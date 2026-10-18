import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const adductorCanal: Block = {
  id: 'adductor_canal',
  categoryId: 'lower_extremity',
  name: 'Bloqueio do Canal Adutor (Nervo Safeno)',
  shortName: 'Canal adutor',
  subtitle: 'Terço médio da coxa • compartimento subsartorial, poupador de quadríceps',
  target: 'Nervo safeno e nervo para o vasto medial no canal dos adutores (fáscia subsartorial)',
  summary:
    'No terço médio da coxa, o músculo sartório forma o teto do canal, com o vasto medial como parede lateral e os adutores longo e magno como assoalho posteromedial. Abaixo do sartório encontra-se a artéria femoral, pulsátil e não compressível, com a veia femoral profunda (posterior) a ela e facilmente colapsável. O nervo safeno surge como uma pequena estrutura hiperecogênica anterolateral à artéria neste nível, imediatamente profunda à membrana vastoadutora, e cruza para a face anteromedial da artéria mais distalmente, próximo ao hiato dos adutores; o nervo para o vasto medial corre no sulco entre o sartório e o vasto medial, lateral à artéria.',
  orientation: { left: 'LATERAL', right: 'MEDIAL' },
  ergonomics: {
    probe: 'Linear de alta frequência (10–15 MHz)',
    depthCm: 4,
    depthText: '2,0 a 4,0 cm',
    patientPosition: 'Decúbito dorsal com coxa ligeiramente abduzida e rodada externamente.',
    probePosition:
      'Transversal na face anteromedial da coxa, no ponto médio entre a espinha ilíaca anterossuperior e a patela. Identifique o sartório como lente hipoecoica superficial e deslize o transdutor caudalmente até que a artéria femoral fique bem sob o seu ventre, ainda antes de mergulhar em direção ao hiato dos adutores. Varrer em sentido proximal e distal para confirmar o trajeto do nervo safeno junto à artéria.',
    needleApproach:
      'Em plano, de lateral para medial, através do músculo vasto medial até penetrar a membrana vastoadutora imediatamente lateral à artéria femoral. A ponta deve ficar anterolateral à artéria, sob o sartório, com o anestésico envolvendo o nervo safeno sem deslocar a artéria.',
    needleTechnique: 'in-plane',
    tips: [
      'Reduza a pressão do transdutor: a veia femoral colapsa facilmente e o nervo safeno fica mais evidente quando os vasos estão descomprimidos.',
      'Se a artéria ainda estiver descoberta, com o sartório medial a ela (triângulo femoral distal), deslize alguns centímetros em sentido distal até que a artéria fique sob o ventre do sartório; se a artéria mergulhar profundamente entre os adutores (hiato dos adutores), volte em sentido proximal.',
      'Aumente a profundidade para 5 cm em pacientes obesos ou com coxa volumosa; a artéria femoral pode ficar a 3–4 cm da pele.',
    ],
  },
  clinical: {
    indications: [
      'Analgesia para artroplastia total de joelho',
      'Cirurgias anteromediais de perna e tornozelo (safenectomia, osteossíntese de tíbia medial, cirurgia do maléolo medial)',
      'Complemento de bloqueio do ciático poplíteo para cobrir a face medial da perna e do tornozelo',
    ],
    doses: [
      { title: 'Analgesia pós-operatória', regimen: 'Ropivacaína 0,2% a 0,375% ou bupivacaína 0,25%: 15 a 20 mL' },
      {
        title: 'Alvo da injeção',
        regimen: 'Depósito único sob a membrana vastoadutora, anterolateral à artéria femoral, envolvendo o nervo safeno sem deslocar os vasos',
      },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Injeção excessivamente proximal pode bloquear o tronco do nervo femoral e causar fraqueza de quadríceps; mantenha-se no terço médio da coxa, sob o sartório, e não no triângulo femoral.',
      'Punção da artéria ou veia femoral superficial: aspire antes de cada injeção e avance a agulha apenas com a ponta visível e lateral à artéria.',
      'Volumes acima de 20 mL podem se espalhar proximalmente pelo canal e atingir ramos motores do quadríceps, perdendo o efeito poupador de motor.',
      'O nervo safeno pode ser difícil de ver: a dispersão do anestésico anterolateral à artéria, sob o sartório, é um marcador suficiente para um bloqueio efetivo.',
      'Comparado ao bloqueio femoral, preserva a força do quadríceps e facilita a deambulação precoce, com analgesia equivalente após artroplastia de joelho.',
    ],
    references: [
      {
        citation:
          'Jaeger P, et al. Adductor canal block versus femoral nerve block and quadriceps strength: a randomized, double-blind, placebo-controlled, crossover study in healthy volunteers. Anesthesiology. 2013;118(2):409-415.',
        doi: '10.1097/ALN.0b013e318279fa0b',
      },
      {
        citation:
          'Gao F, et al. Comparison of adductor canal block with femoral nerve block for total knee arthroplasty: a meta-analysis. Int J Surg. 2017;40:38-45.',
        doi: '10.1016/j.ijsu.2017.02.019',
      },
    ],
  },
  overlays: [
    {
      id: 'ac-sartorius',
      type: 'muscle',
      label: "M. sartório (teto do canal)",
      points: '256,122 727,131 762,235 587,288 308,279',
      label_pos: { x: 500, y: 200 },
      echo: "Ventre muscular em lente, superficial à artéria femoral.",
      note: "O canal fica sob sua face profunda, entre o vasto medial e os adutores.",
    },
    {
      id: 'ac-vm',
      type: 'muscle',
      label: "M. vasto medial",
      points: '64,279 308,279 378,384 378,750 64,750',
      label_pos: { x: 200, y: 520 },
      echo: "Músculo volumoso lateral ao canal.",
      note: "A agulha o atravessa na abordagem lateral → medial.",
    },
    {
      id: 'ac-adductor',
      type: 'muscle',
      label: "M. adutor longo / magno",
      points: '605,419 936,401 936,750 605,750',
      label_pos: { x: 770, y: 580 },
      echo: "Músculos mediais e profundos ao canal.",
      note: "Limite posteromedial do canal dos adutores.",
    },
    {
      id: 'ac-vam',
      type: 'fascia',
      label: "Membrana vastoadutora",
      points: '308,288 430,305 587,288',
      label_pos: { x: 420, y: 330 },
      echo: "Linha hiperecoica entre o sartório e o vasto medial/adutores.",
      note: "A ponta deve ultrapassá-la logo lateral à artéria.",
    },
    {
      id: 'ac-artery',
      type: 'artery',
      label: "A. femoral",
      points: '578,357 563,393 524,415 476,415 437,393 422,357 437,321 476,299 524,299 563,321',
      label_pos: { x: 500, y: 357 },
      echo: "Oval anecoico pulsátil sob o sartório (FA na figura).",
      note: "Referência central; a veia fica posterior a ela.",
      alert: "Não puncionar: aspirar e usar Doppler.",
    },
    {
      id: 'ac-saphenous',
      type: 'nerve',
      label: "N. safeno (posição típica)",
      points: '430,328 426,340 415,348 403,348 392,340 388,328 392,316 403,308 415,308 426,316',
      label_pos: { x: 409, y: 328 },
      echo: "Pequena estrutura hiperecoica anterolateral à artéria (não marcada na figura original).",
      note: "Posição habitual do nervo safeno no terço médio da coxa; confirme com varredura dinâmica.",
      alert: "Evitar injeção intraneural.",
    },
    {
      id: 'ac-la',
      type: 'la_spread',
      label: "Alvo do AL (anterolateral à artéria)",
      points: '369,305 456,296 465,357 378,375',
      label_pos: { x: 417, y: 335 },
      echo: "Coleção anecoica sob o sartório, lateral à artéria.",
      note: "15–20 mL; injeção muito proximal pode atingir o tronco do femoral.",
    },
    {
      id: 'ac-needle',
      type: 'needle',
      label: "Agulha em plano (lateral → medial)",
      points: '81,140 378,335',
      label_pos: { x: 220, y: 220 },
      note: "Atravessa o vasto medial até o plano sob o sartório, lateral à artéria.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/adductor_canal/jcm2026_f2.webp',
    attribution: {
      title: "Impact of Injection Level on Analgesic Efficacy of Adductor Canal Block Following Total Knee Arthroplasty: A Prospective Observational Study",
      authors: "Karatas, Akyol, Tas et al.",
      journal: "Journal of Clinical Medicine",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13363055/",
      pmcid: "PMC13363055",
      figure: "Figura 2",
      caption: "Bloqueio do canal adutor no terço médio da coxa: FA artéria femoral; SM sartório.",
    },
  },
  tags: ['nervo safeno', 'canal adutor', 'joelho', 'artroplastia de joelho', 'poupador de quadríceps', 'membro inferior', 'tornozelo medial'],
};
