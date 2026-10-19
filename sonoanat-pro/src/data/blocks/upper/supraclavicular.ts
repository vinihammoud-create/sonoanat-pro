import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const supraclavicular: Block = {
  id: 'supraclavicular',
  categoryId: 'upper_extremity',
  name: 'Bloqueio Supraclavicular do Plexo Braquial',
  shortName: 'Supraclavicular',
  subtitle: 'Fossa supraclavicular • nível de troncos/divisões do plexo braquial',
  target: 'Divisões e troncos do plexo braquial posterolateral à artéria subclávia, sobre a 1ª costela',
  summary:
    'Identificar a artéria subclávia anecoica e pulsátil repousando sobre a primeira costela (hiperecoica com sombra acústica). O plexo braquial aparece como um "cacho de uvas" hipoecoico posterolateral à artéria. Atenção à pleura: linha hiperecoica brilhante que desliza com a respiração, medial e profunda à costela.',
  orientation: { left: 'LATERAL', right: 'MEDIAL' },
  ergonomics: {
    probe: 'Linear de alta frequência (10–15 MHz)',
    depthCm: 3.5,
    depthText: '2,0 a 3,5 cm',
    patientPosition:
      'Decúbito dorsal com cabeceira elevada a 30°, braço aduzido e cabeça rodada 45° para o lado contralateral.',
    probePosition:
      'Na fossa supraclavicular, imediatamente cranial e paralelo à clavícula, angulando caudalmente em direção ao tórax até ver a artéria subclávia sobre a 1ª costela.',
    needleApproach:
      'Em plano (in-plane), de lateral para medial, mantendo visualização contínua da ponta. Mirar primeiro o "corner pocket" (entre a artéria subclávia e a 1ª costela) e depois o centro do cluster neural. Nunca avançar além da artéria subclávia.',
    needleTechnique: 'in-plane',
    tips: [
      'Use a 1ª costela (hiperecoica com sombra acústica) como "escudo" mecânico para proteger a cúpula pleural.',
      'Ative o Color Doppler antes de puncionar: as artérias escapular dorsal ou cervical transversa podem cruzar o plexo.',
    ],
  },
  clinical: {
    indications: [
      'Cirurgias de úmero distal, cotovelo, antebraço e mão ("raquianestesia do membro superior")',
      'Redução incruenta ou cirúrgica de fraturas de rádio/ulna',
      'Confecção de fístula arteriovenosa em membro superior',
    ],
    doses: [
      { title: 'Anestesia cirúrgica', regimen: 'Ropivacaína 0,5% ou bupivacaína 0,5% com epinefrina: 15 a 20 mL (até 25 mL)' },
      { title: 'Analgesia pós-operatória', regimen: 'Ropivacaína 0,2% a 0,375%: 15 mL' },
      { title: 'Alvo principal', regimen: '50% no "corner pocket" (inferior) + 50% no centro/topo do cluster neural' },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'O "corner pocket" (junção entre a 1ª costela inferiormente, a artéria subclávia medialmente e o plexo lateralmente) garante bloqueio denso do tronco inferior (C8-T1 / nervo ulnar).',
      'Pneumotórax: sempre identifique a 1ª costela e a pleura antes de avançar a agulha; mantenha a profundidade constante.',
      'Injeção intravascular na artéria subclávia ou no ramo escapular dorsal: aspire e use Doppler.',
      'Bloqueio do nervo frênico em ~30% a 50% dos casos: evitar em pneumopatas graves e nunca bilateral.',
    ],
    references: [
      {
        citation: 'Perlas A, et al. Ultrasound-guided supraclavicular block: outcome of 510 consecutive cases. Reg Anesth Pain Med. 2008;33(3):259-265.',
        doi: '10.1016/j.rapm.2007.10.002',
      },
      {
        citation: 'Fredrickson MJ, et al. Neurological complication analysis of ultrasound-guided supraclavicular catheter insertion. Br J Anaesth. 2012;108(5):827-832.',
        doi: '10.1093/bja/aer513',
      },
    ],
  },
  overlays: [
    {
      id: 'sc-plexus',
      type: 'nerve',
      label: 'Plexo braquial (cluster)',
      points: '507,235 600,208 707,222 753,282 727,355 627,375 533,355 493,295',
      label_pos: { x: 622, y: 292 },
      echo: 'Múltiplos nódulos hipoecoicos agrupados ("cacho de uvas"), superficiais e laterais à artéria.',
      note: 'Troncos e divisões situados posterolateralmente à artéria subclávia, a cerca de 1,5 cm da pele nesta imagem.',
      alert: 'Evitar injeção intraneural: resistência alta ou edema do nervo = recuar a agulha.',
    },
    {
      id: 'sc-la-spread',
      type: 'la_spread',
      label: 'Dispersão do AL (corner pocket)',
      points: '573,402 720,388 767,455 747,562 640,588 573,522',
      label_pos: { x: 665, y: 488 },
      echo: 'Coleção anecoica que separa o plexo da artéria e empurra o tronco inferior para cima.',
      note: 'Depósito de anestésico local no corner pocket, entre a artéria subclávia e a 1ª costela; as setas azuis indicam a direção da agulha.',
    },
    {
      id: 'sc-artery',
      type: 'artery',
      label: 'A. subclávia',
      points: '773,468 867,448 933,495 940,588 880,642 787,628 747,548',
      label_pos: { x: 845, y: 548 },
      echo: 'Estrutura anecoica arredondada, pulsátil e não compressível, medial ao plexo.',
      note: 'Repousa sobre a 1ª costela; é a referência central do bloqueio.',
      alert: 'Não avançar a agulha medialmente além da artéria: risco de punção vascular e pleural.',
    },
    {
      id: 'sc-needle',
      type: 'needle',
      label: 'Agulha em plano (lateral → medial)',
      points: '267,375 560,479',
      label_pos: { x: 390, y: 350 },
      note: 'Entrada lateral em ângulo raso, mantendo visualização contínua da haste; a ponta chega ao corner pocket, entre a artéria e a 1ª costela.',
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/supraclavicular/senapati2025_f2.webp',
    attribution: {
      title: 'Comparison of Ultrasound-Guided Costoclavicular Brachial Plexus Block Versus Supraclavicular Brachial Plexus Block for Forearm and Hand Surgery: A Randomized Controlled Trial',
      authors: 'Senapati et al.',
      journal: 'Cureus',
      year: '2025',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12617676/',
      pmcid: 'PMC12617676',
      figure: 'Figura 2',
      caption: 'Direção da agulha (setas azuis) de lateral para medial, em plano, mirando o corner pocket. LAT lateral; MED medial; SA artéria subclávia; BP plexo braquial; LA anestésico local.',
    },
  },
  gallery: [
    {
      mode: 'A',
      baseUrl: 'images/real/supraclavicular/falchetti2026_f1_base.webp',
      attribution: {
        title: 'The Anesthetic Management of a Patient With Advanced Heart Failure Undergoing Non-cardiac Surgery',
        authors: 'Falchetti et al.',
        journal: 'Cureus',
        year: '2026',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13004663/',
        pmcid: 'PMC13004663',
        figure: 'Figura 1 (painel esquerdo)',
        caption: 'US puro: fossa supraclavicular direita, corte transversal.',
      },
    },
    {
      mode: 'A',
      baseUrl: 'images/real/supraclavicular/falchetti2026_f1_annot.webp',
      attribution: {
        title: 'The Anesthetic Management of a Patient With Advanced Heart Failure Undergoing Non-cardiac Surgery',
        authors: 'Falchetti et al.',
        journal: 'Cureus',
        year: '2026',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13004663/',
        pmcid: 'PMC13004663',
        figure: 'Figura 1 (painel direito)',
        caption: 'Anotada: A agulha; B plexo braquial (~1,5 cm); C artéria subclávia; D 1ª costela com sombra acústica; E pleura.',
      },
    },
  ],
  probeImages: [
    {
      mode: 'A',
      baseUrl: 'images/real/supraclavicular/probe_senapati_a.webp',
      attribution: {
        title: "Ultrasound-Guided Selective Trunk Block Combined With Supraclavicular Nerve Block for Awake Shoulder Arthroscopy: A Case Series",
        authors: "Rani, Kumar, Shrivastava et al.",
        journal: "Cureus",
        year: "2026",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13221573/",
        pmcid: "PMC13221573",
        figure: "Figura 1, painel A",
        caption: "Paciente em decúbito dorsal com a cabeça virada para o lado oposto; transdutor linear na fossa supraclavicular, paralelo à clavícula, para ver o corner pocket. Agulha em plano, de lateral para medial.",
      },
    },
  ],
  tags: ['plexo braquial', 'corner pocket', 'membro superior', 'mão', 'antebraço', 'cotovelo'],
};
