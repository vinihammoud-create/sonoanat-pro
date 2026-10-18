import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const tapBlock: Block = {
  id: 'tap_block',
  categoryId: 'trunk_abdomen',
  name: 'Bloqueio do Plano Transverso Abdominal (TAP Block)',
  shortName: 'TAP Block',
  subtitle: 'Parede abdominal lateral • plano entre oblíquo interno e transverso do abdome',
  target: 'Ramos anteriores dos nervos espinhais toracoabdominais (T7 a L1)',
  summary:
    'Posicionar o transdutor na linha axilar média entre a crista ilíaca e a margem costal. Identificar as 3 camadas musculares: oblíquo externo, oblíquo interno e transverso do abdome. O oblíquo interno é o mais espesso; o transverso é o mais fino e profundo, repousando sobre a linha hiperecoica do peritônio, sob a qual as alças intestinais deslizam com a respiração. O plano-alvo é a linha dupla hiperecoica entre o oblíquo interno e o transverso do abdome.',
  orientation: { left: 'POSTEROLATERAL', right: 'ANTEROMEDIAL' },
  ergonomics: {
    probe: 'Linear de alta frequência (10–15 MHz); curvilíneo (2–5 MHz) em obesos',
    depthCm: 3.1,
    depthText: '3,0 a 4,0 cm (3,1 cm na imagem)',
    patientPosition: 'Decúbito dorsal.',
    probePosition:
      'Transdutor transversal (plano axial) na linha axilar média, a meio caminho entre a margem costal e a crista ilíaca. Varrer de anterior para posterior até identificar com clareza as três camadas musculares e o afilamento do oblíquo externo posteriormente; o lado esquerdo da tela corresponde à parede abdominal anterior e o direito, à posterior.',
    needleApproach:
      'Em plano, de ântero-medial para póstero-lateral. O alvo é o plano fascial hiperecoico entre o oblíquo interno e o transverso abdominal. Avançar com a ponta sempre visível, atravessar o oblíquo externo e o interno e injetar 1–2 mL de teste ao atingir o plano: a separação elíptica entre os dois músculos (sinal da lente) confirma a posição correta.',
    needleTechnique: 'in-plane',
    tips: [
      'Com a ponta no plano certo, o anestésico abre uma lente anecoica que empurra o oblíquo interno para cima e o transverso para baixo; se o músculo "incha" sem separação de plano, a ponta está intramuscular.',
      'Mantenha a profundidade fixa e o peritônio sempre em vista: a agulha nunca deve ultrapassar a face profunda do transverso do abdome.',
    ],
  },
  clinical: {
    indications: [
      'Analgesia somática da parede abdominal para laparotomias',
      'Cesariana (analgesia pós-operatória quando não houver morfina neuraxial)',
      'Apendicectomia',
      'Colecistectomia e incisões supraumbilicais (preferir ou associar o TAP subcostal, pois a abordagem lateral cobre mal acima de T10)',
    ],
    doses: [
      { title: 'Analgesia pós-operatória', regimen: 'Ropivacaína 0,2% a 0,25% ou bupivacaína 0,25%: 15 a 20 mL por lado' },
      { title: 'Bloqueio bilateral', regimen: 'Somar os volumes dos dois lados e manter a dose total abaixo da máxima (ex.: 20 mL de ropivacaína 0,25% por lado = 100 mg); diluir para 0,2% quando o peso for baixo' },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Não oferece analgesia visceral (apenas somática da parede parietal); combinar com analgesia multimodal.',
      'Risco de perfuração peritoneal ou lesão hepática/esplênica se a profundidade for perdida.',
      'Cuidado com doses cumulativas em bloqueios bilaterais: a absorção no plano TAP é rápida e os picos plasmáticos ocorrem em 30 a 60 min.',
      'A abordagem lateral (linha axilar média) cobre de forma confiável T10 a T12; para incisões supraumbilicais, preferir o TAP subcostal.',
      'Sinal da lente: dispersão elíptica anecoica entre oblíquo interno e transverso confirma o plano; injeção intramuscular distende o ventre muscular com manchas hipoecoicas, sem separar o plano, e resulta em bloqueio falho.',
    ],
    references: [
      {
        citation:
          'McDonnell JG, et al. The analgesic efficacy of transversus abdominis plane block after abdominal surgery: a prospective randomized controlled trial. Anesth Analg. 2007;104(1):193-197.',
        doi: '10.1213/01.ane.0000250223.49963.0f',
      },
      {
        citation:
          'Baeriswyl M, et al. Efficacy of ultrasound-guided transversus abdominis plane block for adult abdominal surgery: a systematic review and meta-analysis. Anesthesiology. 2015;123(2):399-413.',
        doi: '10.1097/ALN.0000000000000711',
      },
    ],
  },
  overlays: [
    {
      id: 'tap-eo',
      type: 'muscle',
      label: "M. oblíquo externo",
      points: '0,0 1000,0 1000,196 0,200',
      label_pos: { x: 500, y: 100 },
      echo: "Camada muscular mais superficial, hipoecoica com estriações.",
      note: "Primeira das três camadas da parede abdominal lateral.",
    },
    {
      id: 'tap-io',
      type: 'muscle',
      label: "M. oblíquo interno",
      points: '0,214 1000,210 1000,338 0,343',
      label_pos: { x: 500, y: 275 },
      echo: "Camada intermediária, geralmente a mais espessa.",
      note: "O alvo fica imediatamente profundo a ela.",
    },
    {
      id: 'tap-plane',
      type: 'fascia',
      label: "Plano TAP (entre OI e TA)",
      points: '0,345 500,343 1000,340',
      label_pos: { x: 740, y: 322 },
      echo: "Linha dupla hiperecoica entre o oblíquo interno e o transverso.",
      note: "Ponta da agulha (seta) exatamente neste plano; a hidrodissecção abre o espaço em lente.",
    },
    {
      id: 'tap-ta',
      type: 'muscle',
      label: "M. transverso do abdome",
      points: '0,350 1000,346 1000,414 0,418',
      label_pos: { x: 500, y: 384 },
      echo: "Camada mais fina e profunda, com fibras horizontais.",
      note: "Abaixo dele está o peritônio: não ultrapassar.",
    },
    {
      id: 'tap-peritoneum',
      type: 'pleura',
      label: "Peritônio parietal",
      points: '0,420 1000,416 1000,432 0,436',
      label_pos: { x: 500, y: 426 },
      echo: "Linha hiperecoica brilhante que desliza com a respiração.",
      note: "Limite profundo de segurança.",
      alert: "Perfuração peritoneal: alças intestinais logo abaixo (asterisco na figura).",
    },
    {
      id: 'tap-bowel',
      type: 'organ',
      label: "Cavidade peritoneal / alças intestinais",
      points: '0,440 1000,436 1000,660 0,660',
      label_pos: { x: 500, y: 560 },
      echo: "Conteúdo heterogêneo com peristalse e gás (reverberação).",
      note: "Perfuração = risco de lesão de víscera; manter a ponta sempre visível.",
    },
    {
      id: 'tap-la',
      type: 'la_spread',
      label: "Dispersão do AL (sinal da lente, painel 2)",
      points: '129,330 400,300 700,298 943,338 700,386 400,384',
      label_pos: { x: 536, y: 343 },
      echo: "Coleção anecoica em lente que separa o oblíquo interno do transverso.",
      note: "Use o controle \"Imagem anotada\" para ver a dispersão tracejada após a injeção.",
    },
    {
      id: 'tap-needle',
      type: 'needle',
      label: "Agulha em plano",
      points: '614,200 364,350',
      label_pos: { x: 489, y: 250 },
      note: "Haste hiperecoica entrando pela borda do transdutor; a ponta (seta) para no plano TAP.",
    },
  ],
  images: {
    mode: 'B',
    baseUrl: 'images/real/tap_block/cureus2026_f1_base.webp',
    annotatedUrl: 'images/real/tap_block/cureus2026_f2_annot.webp',
    attribution: {
      title: "Transversus Abdominis Plane Block in the Emergency Department for Paracentesis: A Case Report",
      authors: "Patel, Husain, Gappy et al.",
      journal: "Cureus",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13135494/",
      pmcid: "PMC13135494",
      figure: "Figuras 1 (posição da agulha) e 2 (dispersão do anestésico)",
      caption: "Bloqueio TAP: ponta da agulha (seta) no plano entre oblíquo interno (IO) e transverso do abdome (TA); no segundo painel, dispersão do anestésico (tracejado) ao longo do plano. Profundidade 3,1 cm.",
    },
  },
  tags: ['parede abdominal', 'oblíquo interno', 'transverso do abdome', 'laparotomia', 'cesariana', 'colecistectomia', 'plano fascial'],
};
