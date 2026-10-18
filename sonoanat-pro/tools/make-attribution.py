#!/usr/bin/env python3
"""Gera public/images/real/ATTRIBUTION.md a partir das atribuições declaradas em src/data/blocks/**/*.ts."""
from __future__ import annotations

import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
blocks = sorted((root / 'src' / 'data' / 'blocks').rglob('*.ts'))
rows: list[tuple[str, dict]] = []
for f in blocks:
    if f.name == 'shared.ts':
        continue
    text = f.read_text(encoding='utf-8')
    name = re.search(r"name: '([^']+)'", text)
    for m in re.finditer(r"attribution: \{(.*?)\n\s*\},", text, re.S):
        body = m.group(1)
        d = {}
        for k in ('title', 'authors', 'journal', 'year', 'license', 'licenseUrl', 'sourceUrl', 'pmcid', 'figure'):
            mm = re.search(rf'{k}: "((?:[^"\\]|\\.)*)"', body) or re.search(rf"{k}: '((?:[^'\\]|\\.)*)'", body)
            d[k] = mm.group(1) if mm else ''
        url = re.search(r"baseUrl: '([^']+)'", text[m.start() - 400:m.start()])
        rows.append((name.group(1) if name else f.stem, {**d, 'file': url.group(1) if url else ''}))

out = ['# Atribuição das imagens reais', '',
       'Todas as imagens de ultrassom abaixo foram obtidas de artigos de acesso aberto sob licença Creative Commons Attribution (CC BY 4.0), via PubMed Central / Europe PMC, e apenas recortadas e redimensionadas. '
       'Nenhuma imagem foi alterada em seu conteúdo.', '']
for block, d in rows:
    out.append(f"## {block}")
    out.append(f"- Arquivo: `{d['file']}`")
    out.append(f"- Fonte: {d['authors']}. *{d['title']}*. {d['journal']} {d['year']}. {d['figure']}. {d['pmcid']} — {d['sourceUrl']}")
    out.append(f"- Licença: [{d['license']}]({d['licenseUrl']})")
    out.append('')
(root / 'public' / 'images' / 'real' / 'ATTRIBUTION.md').write_text('\n'.join(out), encoding='utf-8')
print(f'{len(rows)} atribuições escritas', file=sys.stderr)
