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
    depthCm: 6,
    depthText: '4,0 a 7,0 cm',
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
      id: 'peng-iliopsoas',
      type: 'muscle',
      label: 'M. iliopsoas',
      points: '180,220 450,215 710,230 700,340 680,455 450,448 220,440 190,330',
      label_pos: { x: 435, y: 315 },
      echo: 'Ventre muscular volumoso, hipoecoico, com estriações fasciais hiperecoicas.',
      note: 'Ventre muscular volumoso repousando anteriormente à cápsula articular do quadril.',
    },
    {
      id: 'peng-tendon',
      type: 'muscle',
      label: 'Tendão do psoas (hiperecoico)',
      points: '550,441 544,454 528,464 505,467 482,464 466,454 460,441 466,428 482,418 505,415 528,418 544,428',
      label_pos: { x: 505, y: 440 },
      echo: 'Estrutura oval fortemente hiperecoica na face profunda do iliopsoas, com anisotropia (muda de brilho ao angular o transdutor).',
      note: 'Estrutura oval fortemente hiperecoica logo acima da eminência iliopectínea. O alvo é o plano entre sua face profunda e o periósteo.',
    },
    {
      id: 'peng-fem-nerve',
      type: 'nerve',
      label: 'N. femoral',
      points: '715,355 709,369 692,378 672,378 655,369 649,355 655,341 672,332 692,332 709,341',
      label_pos: { x: 682, y: 355 },
      echo: 'Estrutura triangular/oval hiperecoica em favo de mel, lateral à artéria femoral.',
      note: 'Situado profundamente à fáscia ilíaca (fora da bainha femoral), sobre o iliopsoas e lateralmente à artéria femoral.',
      alert: 'Dispersão superficial ou volumes > 25 mL podem bloquear o tronco do nervo femoral e causar fraqueza de quadríceps.',
    },
    {
      id: 'peng-fem-art',
      type: 'artery',
      label: 'A. femoral',
      points: '816,350 811,369 797,383 778,388 759,383 745,369 740,350 745,331 759,317 778,312 797,317 811,331',
      label_pos: { x: 778, y: 350 },
      echo: 'Estrutura circular anecoica, pulsátil e não compressível, com fluxo ao Doppler.',
      note: 'Artéria femoral medial ao nervo femoral e superficial ao músculo pectíneo/iliopsoas.',
      alert: 'Risco de punção vascular: manter a agulha lateral ao feixe femoral e aspirar antes de cada injeção.',
    },
    {
      id: 'peng-fem-vein',
      type: 'vein',
      label: 'V. femoral',
      points: '895,362 889,384 872,397 852,397 835,384 829,362 835,340 852,327 872,327 889,340',
      label_pos: { x: 862, y: 362 },
      echo: 'Estrutura anecoica ovalada, totalmente compressível, sem pulsatilidade.',
      note: 'Veia femoral compressível situada medialmente à artéria.',
    },
    {
      id: 'peng-bone',
      type: 'bone',
      label: 'EIAI (lat) → eminência iliopectínea (med)',
      points: '160,445 310,415 430,480 570,480 760,520 760,750 160,750',
      label_pos: { x: 440, y: 530 },
      echo: 'Linha hiperecoica brilhante e contínua com sombra acústica posterior.',
      note: 'Contorno ósseo formando uma concavidade entre a EIAI lateralmente e a eminência iliopectínea medialmente.',
    },
    {
      id: 'peng-spread',
      type: 'la_spread',
      label: 'Dispersão submiofascial (elevando o tendão)',
      points: '405,464 440,455 505,452 565,458 576,479 505,478 435,478',
      label_pos: { x: 470, y: 470 },
      echo: 'Coleção anecoica lenticular entre o periósteo e o tendão do psoas, que se eleva progressivamente.',
      note: 'O anestésico local deve hidrodissecar entre o periósteo e o tendão do psoas, elevando-o.',
    },
    {
      id: 'peng-needle',
      type: 'needle',
      label: 'Agulha em plano (lat → med)',
      points: '95,245 455,472',
      label_pos: { x: 255, y: 322 },
      note: 'Passa medialmente à EIAI até tocar suavemente o osso sob o tendão do psoas.',
    },
  ],
  images: { mode: 'C' },
  tags: ['quadril', 'fratura de colo de fêmur', 'artroplastia de quadril', 'tendão do psoas', 'poupador motor', 'EIAI', 'eminência iliopectínea'],
};
