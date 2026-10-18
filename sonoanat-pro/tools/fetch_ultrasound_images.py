#!/usr/bin/env python3
"""
Baixa figuras de ultrassom com licença CC BY de artigos de acesso aberto.

Fonte primária: Europe PMC (busca com filtro de licença) + página do PubMed Central
(figuras servidas em cdn.ncbi.nlm.nih.gov). Fonte secundária opcional: Open-i (NLM),
que fica em manutenção com frequência; falhas são ignoradas.

Uso (na pasta sonoanat-pro):
    python -I tools/fetch_ultrasound_images.py --out tools/image_raw --queries tools/image_queries.json

Saída: <out>/<blockId>/<PMCID>_<fig>.jpg e <out>/sources.json com a atribuição de cada figura.
Só biblioteca padrão (urllib). Revise as imagens manualmente antes de usá-las no app.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

UA = "SonoAnatPro-ImageFetcher/1.0 (+https://github.com/vinihammoud-create/sonoanat-pro; educational use)"
EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest"
PMC_PAGE = "https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/"
OPENI = "https://openi.nlm.nih.gov/api/search"
US_WORDS = re.compile(r"ultraso|sonogra|echogen|hypoechoic|hyperechoic|\bUS\b|probe|transducer|needle", re.I)
NOT_US = re.compile(r"flow ?chart|forest plot|funnel|kaplan|consort|prisma|diagram|schematic|boxplot|box plot|bar chart|histogram|survival", re.I)
CC_BY = re.compile(r"creativecommons\.org/licenses/by(/|$)", re.I)
CC_BAD = re.compile(r"/by-(nc|nd|sa)", re.I)


def get(url: str, timeout: int = 40, retries: int = 3, sleep: float = 0.6) -> bytes:
    last: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                data = r.read()
            time.sleep(sleep)
            return data
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:  # noqa: PERF203
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"GET falhou: {url}: {last}")


def epmc_search(query: str, page_size: int) -> list[dict]:
    q = f"({query}) AND OPEN_ACCESS:y AND LICENSE:cc AND HAS_FT:y"
    url = f"{EPMC}/search?" + urllib.parse.urlencode({"query": q, "format": "json", "resultType": "lite", "pageSize": page_size})
    data = json.loads(get(url))
    return [r for r in data.get("resultList", {}).get("result", []) if r.get("pmcid")]


def epmc_fulltext(pmcid: str) -> ET.Element | None:
    try:
        raw = get(f"{EPMC}/{pmcid}/fullTextXML")
    except RuntimeError:
        return None
    try:
        return ET.fromstring(raw)
    except ET.ParseError:
        return None


def license_of(root: ET.Element) -> str | None:
    """Retorna a URL da licença CC BY (sem NC/ND/SA) ou None."""
    for el in root.iter():
        tag = el.tag.split('}')[-1]
        if tag in ("license_ref", "license") or tag == "ext-link":
            for attr, val in el.attrib.items():
                if attr.endswith("href") and CC_BY.search(val or "") and not CC_BAD.search(val):
                    return val
            text = (el.text or "").strip()
            if CC_BY.search(text) and not CC_BAD.search(text):
                return text
    # Alguns artigos só trazem o texto "Creative Commons Attribution License" sem URL.
    blob = " ".join((t or "") for t in root.itertext())
    if re.search(r"Creative Commons Attribution(?! ?[-–] ?Non)(?! ?[-–] ?No)(?! ?[-–] ?Share)", blob) and not re.search(r"Non[- ]?Commercial|NoDerivs|ShareAlike", blob[:20000]):
        return "https://creativecommons.org/licenses/by/4.0/"
    return None


def figures_of(root: ET.Element) -> list[dict]:
    figs = []
    for fig in root.iter():
        if fig.tag.split('}')[-1] != "fig":
            continue
        label = ""
        caption = ""
        href = ""
        for el in fig.iter():
            t = el.tag.split('}')[-1]
            if t == "label" and not label:
                label = "".join(el.itertext()).strip()
            elif t == "caption" and not caption:
                caption = " ".join("".join(el.itertext()).split())
            elif t == "graphic" and not href:
                for attr, val in el.attrib.items():
                    if attr.endswith("href"):
                        href = val
        if href:
            figs.append({"id": fig.attrib.get("id", ""), "label": label, "caption": caption, "href": href})
    return figs


def pmc_blob_urls(pmcid: str) -> dict[str, str]:
    """Mapeia nome-base do graphic -> URL no CDN do PMC, raspando a página do artigo."""
    try:
        page = get(PMC_PAGE.format(pmcid=pmcid)).decode("utf-8", "replace")
    except RuntimeError:
        return {}
    out: dict[str, str] = {}
    for m in re.finditer(r"https://cdn\.ncbi\.nlm\.nih\.gov/pmc/blobs/[^\"'\s]+", page):
        url = html.unescape(m.group(0))
        base = url.rsplit("/", 1)[-1].rsplit(".", 1)[0]
        out.setdefault(base, url)
    return out


def meta_of(root: ET.Element) -> dict:
    title = ""
    journal = ""
    year = ""
    authors: list[str] = []
    for el in root.iter():
        t = el.tag.split('}')[-1]
        if t == "article-title" and not title:
            title = " ".join("".join(el.itertext()).split())
        elif t == "journal-title" and not journal:
            journal = "".join(el.itertext()).strip()
        elif t == "year" and not year:
            year = (el.text or "").strip()
        elif t == "surname" and len(authors) < 3:
            authors.append((el.text or "").strip())
    a = ", ".join(x for x in authors if x)
    if len(authors) >= 3:
        a += " et al."
    return {"title": title, "journal": journal, "year": year, "authors": a}


def openi_search(query: str, n: int) -> list[dict]:
    url = OPENI + "?" + urllib.parse.urlencode({"query": query, "it": "xg", "lic": "by", "m": 1, "n": n})
    try:
        raw = get(url, retries=1)
        data = json.loads(raw)
    except Exception:
        return []
    return data.get("list", []) or []


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # type: ignore[attr-defined]
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--queries", required=True)
    ap.add_argument("--articles-per-query", type=int, default=12)
    ap.add_argument("--max-per-block", type=int, default=8)
    ap.add_argument("--blocks", default="", help="lista separada por vírgula para limitar os blocos")
    ap.add_argument("--no-openi", action="store_true")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    queries: dict[str, list[str]] = json.loads(Path(args.queries).read_text(encoding="utf-8"))
    only = {b for b in args.blocks.split(",") if b}
    sources_path = out / "sources.json"
    sources: dict[str, dict] = json.loads(sources_path.read_text(encoding="utf-8")) if sources_path.exists() else {}
    article_cache: dict[str, tuple] = {}

    for block_id, qs in queries.items():
        if only and block_id not in only:
            continue
        folder = out / block_id
        folder.mkdir(exist_ok=True)
        saved = len(list(folder.glob("*.jpg"))) + len(list(folder.glob("*.png")))
        print(f"== {block_id} (já salvas: {saved})", flush=True)
        seen_pmc: set[str] = set()
        for q in qs:
            if saved >= args.max_per_block:
                break
            try:
                hits = epmc_search(q, args.articles_per_query)
            except RuntimeError as e:
                print("   busca falhou:", e)
                continue
            print(f"   {len(hits)} artigos para: {q}")
            for hit in hits:
                if saved >= args.max_per_block:
                    break
                pmcid = hit["pmcid"]
                if pmcid in seen_pmc:
                    continue
                seen_pmc.add(pmcid)
                if pmcid in article_cache:
                    root, lic, figs, blobs, meta = article_cache[pmcid]
                else:
                    root = epmc_fulltext(pmcid)
                    if root is None:
                        article_cache[pmcid] = (None, None, [], {}, {})
                        continue
                    lic = license_of(root)
                    figs = figures_of(root) if lic else []
                    blobs = pmc_blob_urls(pmcid) if figs else {}
                    meta = meta_of(root) if figs else {}
                    article_cache[pmcid] = (root, lic, figs, blobs, meta)
                if not lic:
                    print(f"   {pmcid}: licença não é CC BY, pulando")
                    continue
                for fig in figs:
                    if saved >= args.max_per_block:
                        break
                    cap = f"{fig['label']} {fig['caption']}"
                    if not US_WORDS.search(cap) or NOT_US.search(cap):
                        continue
                    base = fig["href"].rsplit("/", 1)[-1].rsplit(".", 1)[0]
                    url = blobs.get(base)
                    if not url:
                        continue
                    ext = ".png" if url.lower().endswith(".png") else ".jpg"
                    name = f"{pmcid}_{re.sub(r'[^A-Za-z0-9]+', '-', fig['id'] or base)[:40]}{ext}"
                    dest = folder / name
                    key = f"{block_id}/{name}"
                    if dest.exists():
                        continue
                    try:
                        data = get(url)
                    except RuntimeError as e:
                        print("   download falhou:", e)
                        continue
                    if len(data) < 15000:
                        continue
                    dest.write_bytes(data)
                    saved += 1
                    sources[key] = {
                        "blockId": block_id,
                        "pmcid": pmcid,
                        "pmid": hit.get("pmid"),
                        "doi": hit.get("doi"),
                        "title": meta.get("title") or hit.get("title"),
                        "authors": meta.get("authors") or hit.get("authorString"),
                        "journal": meta.get("journal") or hit.get("journalTitle"),
                        "year": meta.get("year") or hit.get("pubYear"),
                        "figure": fig["label"] or fig["id"],
                        "caption": fig["caption"][:600],
                        "license": "CC BY",
                        "licenseUrl": lic if lic.startswith("http") else "https://creativecommons.org/licenses/by/4.0/",
                        "sourceUrl": PMC_PAGE.format(pmcid=pmcid),
                        "imageUrl": url,
                    }
                    print(f"   salvo {key} ({len(data) // 1024} KB) — {fig['caption'][:70]}")
                    sources_path.write_text(json.dumps(sources, ensure_ascii=False, indent=2), encoding="utf-8")
        if not args.no_openi and saved < args.max_per_block:
            for item in openi_search(f"{block_id.replace('_', ' ')} ultrasound", 5):
                img = item.get("imgLarge") or item.get("imgThumb")
                lic = str(item.get("licenseType") or "")
                if not img or not re.match(r"^by(\s|$|-?[0-9])", lic, re.I) or re.search(r"nc|nd|sa", lic, re.I):
                    continue
                name = f"openi_{item.get('uid', 'x')}.png"
                dest = folder / name
                if dest.exists():
                    continue
                try:
                    data = get("https://openi.nlm.nih.gov" + img)
                except RuntimeError:
                    continue
                dest.write_bytes(data)
                saved += 1
                sources[f"{block_id}/{name}"] = {
                    "blockId": block_id, "pmcid": item.get("pmcid"), "title": item.get("title"), "authors": item.get("authors"),
                    "journal": item.get("journal_title"), "year": item.get("pub_date"), "caption": (item.get("image") or {}).get("caption", "")[:600],
                    "license": "CC BY", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
                    "sourceUrl": f"https://openi.nlm.nih.gov/detailedresult?img={item.get('uid')}", "imageUrl": "https://openi.nlm.nih.gov" + img,
                }
                sources_path.write_text(json.dumps(sources, ensure_ascii=False, indent=2), encoding="utf-8")
                if saved >= args.max_per_block:
                    break
    print(f"Concluído. {len(sources)} figuras registradas em {sources_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
