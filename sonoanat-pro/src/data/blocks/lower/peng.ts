import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const peng: Block = {
  id: 'peng',
  categoryId: 'lower_extremity',
  name: 'Bloqueio PENG (Pericapsular Nerve Group)',
  shortName: 'PENG',
  subtitle: 'Plano miofascial entre o tendão do psoas e o ramo púbico superior',
  target: 'Ramos articulares do nervo femoral, nervo obturador e obturador acessório na eminência iliopúbica (iliopectínea)',
  summary:
    'Alinhar o transdutor entre a espinha ilíaca ântero-inferior (EIAI) e a eminência iliopúbica. Identificar o tendão do psoas hiperecogênico repousando sobre o osso ilíaco. O contorno ósseo forma uma concavidade entre a EIAI (lateral) e a eminência iliopectínea (medial), coberta pelo ventre volumoso do iliopsoas; o feixe femoral (nervo, artéria e veia) fica medial e superficial, fora da trajetória da agulha.',
  orientation: { left: 'LATERAL (EIAI)', right: 'MEDIAL (PÚBIS)' },
  ergonomics: {
    probe: 'Convexo de baixa frequência (2–5 MHz) ou linear em pacientes magros',
    depthCm: 5,
    depthText: '4,0 a 7,0 cm (5 cm na imagem)',
    patientPosition: 'Decúbito dorsal neutro.',
    probePosition:
      'Inicialmente sobre a EIAS no plano transversal, deslizando caudalmente até a EIAI, e então rodado ~45° alinhado com o ramo púbico até visualizar a EIAI, a eminência iliopectínea e o tendão do psoas.',
    needleApproach:
      'Em plano (in-plane), de lateral para medial, passando entre a EIAI e o tendão do psoas até tocar o periósteo entre a EIAI e a eminência iliopectínea. A agulha deve ser posicionada sob o tendão do psoas, depositando o anestésico entre o tendão e a superfície óssea do ramo púbico.',
    needleTechnique: 'in-plane',
    tips: [
      'Se o tendão do psoas não for visto, deslize e rode levemente o transdutor: ele aparece como oval hiperecoica sobre a concavidade óssea, medial à EIAI; a ponta deve ficar entre ele e o periósteo.',
      'Ative o Color Doppler antes de puncionar: a artéria circunflexa femoral medial e ramos da artéria femoral podem cruzar o plano de injeção.',
    ],
  },
  clinical: {
    indications: [
      'Analgesia de fratura de colo de fêmur / quadril na sala de emergência ou pré-raquianestesia',
      'Artroplastia total de quadril (ATQ) — preserva força motora do quadríceps (poupador motor)',
    ],
    doses: [
      {
        title: 'Analgesia pericapsular (n. femoral, obturatório e obturatório acessório)',
        regimen: 'Ropivacaína 0,2% a 0,375% ou levobupivacaína 0,25%: 15 a 20 mL',
      },
      { title: 'Alternativa (concentração maior)', regimen: 'Ropivacaína 0,375% a 0,5%: 20 mL' },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'O sinal de sucesso ecográfico é a elevação ("lifting") do tendão do psoas hiperecoico com dispersão submiofascial sobre o osso.',
      'Evite injetar dentro da substância do tendão do psoas; se houver alta resistência na seringa, recue 1 mm e gire o bisel.',
      'Volumes > 25 mL podem dispersar superficialmente e bloquear o tronco do n. femoral causando fraqueza de quadríceps.',
      'Preserva a força do quadríceps, mas dispersão proximal excessiva pode atingir o nervo femoral.',
      'Certificar-se do contato com o osso para garantir o plano interfascial profundo.',
    ],
    references: [
      {
        citation:
          'Girón-Arango L, et al. Pericapsular nerve group (PENG) block for hip fracture: a novel technique with anatomical and clinical basis. Reg Anesth Pain Med. 2018;43(8):859-863.',
        doi: '10.1097/AAP.0000000000000847',
      },
      {
        citation:
          'Morrison C, et al. Analgesic efficacy of the PENG block in hip fractures: a systematic review. Br J Anaesth. 2021;126(3):723-731.',
        doi: '10.1016/j.bja.2020.12.025',
      },
    ],
  },
  overlays: [
    {
      id: 'peng-bone',
      type: 'bone',
      label: "EIAI → eminência iliopúbica (osso)",
      points: '199,223 290,261 397,329 504,371 611,395 718,421 825,456 916,505 916,704 199,704',
      label_pos: { x: 560, y: 560 },
      echo: "Linha hiperecoica convexa com sombra acústica posterior.",
      note: "Da espinha ilíaca ântero-inferior (lateral, à esquerda) à eminência iliopúbica (medial): a agulha deve tocar o periósteo entre elas.",
    },
    {
      id: 'peng-iliopsoas',
      type: 'muscle',
      label: "M. iliopsoas",
      points: '305,169 611,192 718,246 733,398 504,360 351,299 275,246',
      label_pos: { x: 500, y: 270 },
      echo: "Ventre muscular hipoecoico sobre o osso, anterior à cápsula articular.",
      note: "O tendão do psoas (hiperecoico) está na sua porção medial, sobre a eminência iliopúbica.",
    },
    {
      id: 'peng-tendon',
      type: 'muscle',
      label: "Tendão do psoas (hiperecoico)",
      points: '489,307 596,299 626,345 534,375 466,352',
      label_pos: { x: 548, y: 335 },
      echo: "Estrutura oval fortemente hiperecoica logo acima do osso.",
      note: "A agulha passa sob ele; o sinal de sucesso é o seu \"levantamento\" pelo AL.",
    },
    {
      id: 'peng-fem-art',
      type: 'artery',
      label: "A. femoral",
      points: '675,245 669,265 652,277 630,277 613,265 607,245 613,225 630,213 652,213 669,225',
      label_pos: { x: 641, y: 245 },
      echo: "Círculo anecoico pulsátil, superficial e medial.",
      note: "Marca o limite medial; o nervo femoral fica lateral a ela, superficial à fáscia ilíaca.",
      alert: "Não direcionar a agulha medialmente em direção à artéria.",
    },
    {
      id: 'peng-la',
      type: 'la_spread',
      label: "Dispersão submiofascial (painel B)",
      points: '458,352 672,391 672,429 458,395',
      label_pos: { x: 565, y: 392 },
      echo: "No painel pós-injeção, o AL anecoico separa o tendão do psoas do periósteo.",
      note: "Arraste o controle \"Imagem anotada\" para ver a dispersão após a injeção.",
    },
    {
      id: 'peng-needle',
      type: 'needle',
      label: "Agulha em plano (lateral → medial)",
      points: '61,139 504,371',
      label_pos: { x: 230, y: 200 },
      note: "Entrada lateral, passando medialmente à EIAI até tocar o osso sob o tendão do psoas.",
    },
  ],
  images: {
    mode: 'B',
    baseUrl: 'images/real/peng/frontiers2026_f1_base.webp',
    annotatedUrl: 'images/real/peng/frontiers2026_f1_annot.webp',
    attribution: {
      title: "Minimum effective concentration of ropivacaine for ultrasound-guided pericapsular nerve group block to relieve spinal anesthesia positioning pain in elderly patients with femoral intertrochanteric fracture: a double-blind biased-coin dose-finding study",
      authors: "Zhai, Yue, Wang et al.",
      journal: "Frontiers in Medicine",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13493499/",
      pmcid: "PMC13493499",
      figure: "Figura 1, painéis A (pré-injeção) e B (pós-injeção)",
      caption: "Bloqueio PENG guiado por ultrassom com transdutor convexo: painel A antes da injeção, painel B após a injeção mostrando a dispersão do anestésico sob o tendão do psoas.",
    },
  },
  probeImages: [
    {
      mode: 'A',
      baseUrl: 'images/real/peng/probe_cureus_a.webp',
      attribution: {
        title: "Analgesic and Functional Outcomes of Ultrasound-Guided Pericapsular Nerve Group (PENG), Fascia Iliaca, and Femoral Nerve Blocks in Hip Fracture Surgery: A Randomized Controlled Trial",
        authors: "Senapati, Sahoo, Panda et al.",
        journal: "Cureus",
        year: "2026",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12988447/",
        pmcid: "PMC12988447",
        figure: "Figura 1, painel a",
        caption: "Quadril neutro; transdutor convexo alinhado da espinha ilíaca ântero-inferior à eminência iliopúbica (cefálico à esquerda, medial para baixo na foto) e agulha entrando pela borda lateral, em plano.",
      },
    },
  ],
  tags: ['quadril', 'fratura de colo de fêmur', 'artroplastia de quadril', 'tendão do psoas', 'poupador motor', 'EIAI', 'eminência iliopectínea'],
};
