import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const wristBlock: Block = {
  id: 'wrist_block',
  categoryId: 'upper_extremity',
  name: 'Bloqueio dos Nervos do Punho (Mediano, Ulnar e Radial)',
  shortName: 'Punho',
  subtitle: 'Terço distal do antebraço • nervos mediano, ulnar e ramo superficial do radial',
  target: 'Nervos mediano, ulnar e ramo superficial do nervo radial no terço distal do antebraço',
  summary:
    'Corte transversal do antebraço distal, cerca de 5 cm proximal à prega do punho. O nervo mediano aparece como estrutura ovalada em "favo de mel" (fascículos hipoecoicos com epineuro hiperecoico) entre os tendões dos flexores superficial e profundo dos dedos, com o flexor radial do carpo radialmente e o palmar longo superficial e ulnar a ele. O nervo ulnar fica imediatamente ulnar à artéria ulnar, sob o flexor ulnar do carpo. O ramo superficial do nervo radial corre adjacente à artéria radial, lateral a ela. O pronador quadrado forma a banda muscular profunda, repousando sobre o rádio e a ulna.',
  orientation: { left: 'RADIAL', right: 'ULNAR' },
  ergonomics: {
    probe: 'Linear de alta frequência (12–18 MHz)',
    depthCm: 2,
    depthText: '1,5 a 2,5 cm',
    patientPosition: 'Decúbito dorsal com antebraço supinado em mesa de apoio.',
    probePosition:
      'Transversal (eixo curto) sobre a face volar do antebraço, 5 a 7 cm proximal à prega do punho, com a marca do transdutor voltada para o lado radial. Deslize proximal e distalmente para confirmar o nervo mediano entre os tendões flexores; translade para o bordo ulnar para ver a artéria ulnar com o nervo ulnar ao lado, e para o bordo radial para ver a artéria radial com o ramo superficial do nervo radial.',
    needleApproach:
      'Em plano (in-plane) ou fora de plano para cada nervo individualmente. Para o mediano, entrada pelo bordo ulnar do transdutor avançando em direção radial até a face do nervo; para o ulnar e o radial superficial, mirar o espaço perineural ao lado da respectiva artéria, sempre com a ponta visível.',
    needleTechnique: 'both',
    tips: [
      'Nervo ulnar: 5 a 7 cm proximal ao punho, injetar 3 a 5 mL imediatamente ulnar à artéria ulnar, sob o flexor ulnar do carpo. O ramo dorsal se destaca cerca de 5 a 8 cm proximal à prega; se a cirurgia envolver o dorso ulnar da mão, bloqueie mais proximalmente (terço médio do antebraço, 8 a 10 cm), onde o nervo ainda está indiviso.',
      'Ramo superficial do nervo radial: bloquear junto à artéria radial no terço médio do antebraço, antes de o ramo se afastar dela sob o tendão do braquiorradial (7 a 9 cm proximal ao estiloide), ou de forma subcutânea na tabaqueira anatômica, onde já se dividiu em filetes dorsais.',
      'Mova os dedos do paciente durante a varredura: os tendões deslizam e o nervo mediano permanece praticamente imóvel, facilitando a diferenciação.',
      'Use pouca pressão com o transdutor e Color Doppler para localizar as artérias radial e ulnar antes de puncionar.',
    ],
  },
  clinical: {
    indications: [
      'Cirurgias e procedimentos na mão e nos dedos sem necessidade de bloqueio motor de todo o braço',
      'Suturas e desbridamentos de ferimentos na mão',
      'Complementação de bloqueio de plexo braquial incompleto ("resgate" distal)',
    ],
    doses: [
      { title: 'Anestesia cirúrgica de curta/média duração', regimen: 'Lidocaína 1,5% ou mepivacaína 1,5%: 3 a 5 mL por nervo' },
      { title: 'Analgesia prolongada', regimen: 'Ropivacaína 0,375%: 3 a 5 mL por nervo' },
      { title: 'Volume total', regimen: 'Mediano + ulnar + radial superficial: 9 a 15 mL no total, depositados em crescente perineural' },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Evitar punção das artérias radial e ulnar: identifique-as com Doppler e mantenha a ponta da agulha sempre visível.',
      'Não injetar sob alta pressão dentro do túnel do carpo; bloqueie o mediano proximalmente ao retináculo dos flexores, no antebraço distal.',
      'Diferencie o nervo mediano dos tendões: o nervo mantém o aspecto em favo de mel ao mover os dedos, enquanto os tendões deslizam e exibem forte anisotropia ao inclinar o transdutor.',
      'O bloqueio do punho preserva a motricidade dos flexores e extensores do antebraço, o que permite avaliação funcional intraoperatória e alta precoce.',
      'Resistência elevada à injeção ou aumento do diâmetro do nervo indicam posição intraneural: recue a agulha antes de prosseguir.',
    ],
    references: [
      {
        citation: 'Delaunay L, et al. Ultrasound-guided wrist block: description of a new technique. Reg Anesth Pain Med. 2009;34(6):592-595.',
      },
      {
        citation: 'Koscielniak-Nielsen ZJ. Ultrasound-guided peripheral nerve blocks in the upper extremity: an update. Curr Opin Anaesthesiol. 2009;22(5):637-642.',
        doi: '10.1097/ACO.0b013e32832f05a0',
      },
    ],
  },
  overlays: [
    {
      id: 'wr-median',
      type: 'nerve',
      label: "N. mediano (entrada do túnel do carpo)",
      points: '366,85 411,70 549,72 623,104 625,127 411,134 366,119',
      label_pos: { x: 495, y: 102 },
      echo: "Estrutura oval em favo de mel, contornada pelo epineuro hiperecoico (traçado da figura).",
      note: "Fica superficial, logo sob o retináculo dos flexores; superficial aos tendões.",
      alert: "Injetar ao redor, fora do túnel sob alta pressão.",
    },
    {
      id: 'wr-retinaculum',
      type: 'fascia',
      label: "Retináculo dos flexores",
      points: '347,140 644,136',
      label_pos: { x: 495, y: 160 },
      echo: "Linha hiperecoica que cobre o nervo.",
      note: "Teto do túnel do carpo.",
    },
    {
      id: 'wr-tendons',
      type: 'muscle',
      label: "Tendões flexores (FDS / FDP)",
      points: '336,154 687,149 687,266 336,266',
      label_pos: { x: 511, y: 210 },
      echo: "Feixes hiperecoicos fibrilares, com anisotropia ao bascular o transdutor.",
      note: "Diferenciar do nervo: tendões deslizam ao mover os dedos.",
    },
    {
      id: 'wr-pisiform',
      type: 'bone',
      label: "Osso do carpo (pisiforme)",
      points: '591,372 750,382 750,435 591,425',
      label_pos: { x: 670, y: 404 },
      echo: "Cortical hiperecoica com sombra acústica (lado ulnar).",
      note: "Referência óssea para a entrada do túnel.",
    },
    {
      id: 'wr-la',
      type: 'la_spread',
      label: "Alvo do AL ao redor do mediano",
      points: '358,66 634,64 639,149 352,149',
      label_pos: { x: 495, y: 70 },
      echo: "Halo anecoico circundando o nervo.",
      note: "3–5 mL; não injetar dentro do túnel sob alta pressão.",
    },
    {
      id: 'wr-needle',
      type: 'needle',
      label: "Agulha em plano (ulnar → radial)",
      points: '878,42 644,101',
      label_pos: { x: 760, y: 48 },
      note: "Trajeto raso, superficial ao retináculo, até a borda do nervo.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/wrist_block/diagnostics2026_f1.webp',
    attribution: {
      title: "Ultrasound-Based Severity Stratification in Carpal Tunnel Syndrome: Median Nerve Cross-Sectional Area for Distinguishing Severe from Moderate Disease",
      authors: "Peker, Alaamel, Cengiz et al.",
      journal: "Diagnostics",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13465334/",
      pmcid: "PMC13465334",
      figure: "Figura 1",
      caption: "Nervo mediano na entrada proximal do túnel do carpo (área de secção transversa traçada); o pisiforme é a referência óssea.",
    },
  },
  tags: ['punho', 'nervo mediano', 'nervo ulnar', 'nervo radial', 'mão', 'dedos', 'antebraço', 'túnel do carpo'],
};
