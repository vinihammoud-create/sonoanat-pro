import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const lateralFemoralCutaneous: Block = {
  id: 'lateral_femoral_cutaneous',
  categoryId: 'lower_extremity',
  name: 'Bloqueio do Nervo Cutâneo Lateral da Coxa (LFCN)',
  shortName: 'Cutâneo lateral da coxa',
  subtitle: 'Região infrainguinal lateral • sulco entre o tensor da fáscia lata e o sartório',
  target: 'Nervo cutâneo lateral da coxa próximo à espinha ilíaca anterossuperior (EIAS)',
  summary:
    'Medial e caudal à EIAS, identificar o músculo sartório (medial) e o músculo tensor da fáscia lata (lateral), ambos sob a fáscia lata hiperecoica. O nervo situa-se na bifurcação fascial entre esses dois músculos: um pequeno ponto hipoecoico com halo hiperecoico, mergulhado no sulco preenchido por gordura, imediatamente profundo à fáscia lata. Pode estar sobre o sartório ou entre o sartório e o tensor da fáscia lata; o trajeto é variável e o nervo pode se dividir precocemente em ramos.',
  orientation: { left: 'LATERAL', right: 'MEDIAL' },
  ergonomics: {
    probe: 'Linear de alta frequência (10–15 MHz)',
    depthCm: 2.5,
    depthText: '1,0 a 2,5 cm',
    patientPosition: 'Decúbito dorsal, com a coxa em posição neutra e leve exposição da região infrainguinal lateral.',
    probePosition:
      'Transdutor transversal (eixo curto) 1 a 2 cm medial e caudal à EIAS, com a extremidade lateral apoiada sobre a espinha. Varrer caudalmente ao longo do bordo lateral do sartório até ver o sulco adiposo entre o sartório e o tensor da fáscia lata, logo abaixo da fáscia lata; se o nervo não aparecer, deslizar 2 a 4 cm mais caudal (onde já corre sobre o sartório) e seguir o trajeto de volta em direção à EIAS.',
    needleApproach:
      'Em plano, de lateral para medial. Entrada na borda lateral do transdutor, trajeto raso e quase paralelo à pele, atravessando a fáscia lata para depositar o anestésico no sulco adiposo ao redor do nervo, sem penetrar o ventre muscular.',
    needleTechnique: 'in-plane',
    tips: [
      'O nervo é pequeno: use a hidrodissecção com 1 a 2 mL de soro fisiológico para confirmar o plano sob a fáscia lata antes de injetar o anestésico.',
      'Trabalhe com profundidade pequena (2 a 2,5 cm) e frequência alta: as referências-chave são a fáscia lata e o sulco adiposo entre os dois músculos, estruturas muito superficiais.',
    ],
  },
  clinical: {
    indications: [
      'Meralgia parestésica (diagnóstico e tratamento)',
      'Enxertos cutâneos e áreas doadoras na face lateral da coxa',
      'Analgesia complementar de quadril (artroplastia e fraturas), em associação a outros bloqueios',
    ],
    doses: [
      { title: 'Bloqueio analgésico / diagnóstico', regimen: 'Ropivacaína 0,2% ou lidocaína 1%: 5 a 8 mL' },
      {
        title: 'Alvo da injeção',
        regimen: 'Sob a fáscia lata, no sulco adiposo entre o tensor da fáscia lata e o sartório, envolvendo o nervo; evitar injeção intramuscular',
      },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Variação anatômica frequente do trajeto do nervo em relação à EIAS: pode passar sobre, medial ou até lateral à espinha, e dividir-se precocemente em ramos.',
      'O nervo pode estar sobre o sartório ou no sulco entre o sartório e o tensor da fáscia lata; sempre varrer caudalmente antes de decidir o ponto de injeção.',
      'Injeção intramuscular (no sartório ou no tensor da fáscia lata) ou profunda demais, sob a fáscia ilíaca sobre o iliopsoas, falha o bloqueio e, com volumes maiores, pode dispersar até o nervo femoral, com fraqueza do quadríceps indesejada em um bloqueio puramente sensitivo.',
      'Não há vasos relevantes no trajeto lateral da agulha; os vasos e o nervo femoral ficam bem mediais ao sartório. Mesmo assim, aspirar antes de injetar.',
      'Nervo puramente sensitivo: dor ou parestesia à injeção indica agulha intraneural; recuar antes de injetar.',
      'Para meralgia parestésica, o bloqueio diagnóstico com o menor volume da faixa (cerca de 5 mL) ajuda a diferenciar de radiculopatia L2-L3.',
    ],
    references: [
      {
        citation: 'Hurdle MF, et al. Ultrasound-guided lateral femoral cutaneous nerve block: technical note. Mayo Clin Proc. 2007;82(11):1458-1460.',
      },
    ],
  },
  overlays: [
    {
      id: 'lfcn-fascia-lata',
      type: 'fascia',
      label: "Fáscia lata",
      points: '41,259 449,266 1000,256',
      label_pos: { x: 700, y: 240 },
      echo: "Linha hiperecoica superficial sobre os músculos.",
      note: "O nervo fica imediatamente profundo a ela, no sulco entre TFL e sartório.",
    },
    {
      id: 'lfcn-tfl',
      type: 'muscle',
      label: "M. tensor da fáscia lata",
      points: '41,300 408,300 435,395 408,558 41,558',
      label_pos: { x: 220, y: 430 },
      echo: "Ventre muscular lateral (TFLM).",
      note: "Limite lateral do sulco.",
    },
    {
      id: 'lfcn-sartorius',
      type: 'muscle',
      label: "M. sartório",
      points: '544,293 1000,279 1000,558 571,558 517,395',
      label_pos: { x: 770, y: 430 },
      echo: "Ventre muscular medial (SaM).",
      note: "Limite medial do sulco.",
    },
    {
      id: 'lfcn-nerve',
      type: 'nerve',
      label: "N. cutâneo lateral da coxa",
      points: '471,283 467,291 456,296 442,296 431,291 427,283 431,275 442,270 456,270 467,275',
      label_pos: { x: 449, y: 283 },
      echo: "Pequena estrutura hipoecoica/hiperecoica no sulco preenchido por gordura (seta LFCN).",
      note: "Pode estar sobre o sartório ou entre sartório e TFL; varra proximal e distalmente.",
      alert: "Nervo fino: injetar ao redor, nunca dentro.",
    },
    {
      id: 'lfcn-la',
      type: 'la_spread',
      label: "Alvo do AL (sob a fáscia lata)",
      points: '408,270 490,267 496,300 415,302',
      label_pos: { x: 452, y: 284 },
      echo: "Pequena coleção anecoica no sulco entre os músculos.",
      note: "5–8 mL.",
    },
    {
      id: 'lfcn-needle',
      type: 'needle',
      label: "Agulha em plano (lateral → medial)",
      points: '54,204 428,279',
      label_pos: { x: 240, y: 230 },
      note: "Entrada lateral, rasa, até o sulco sob a fáscia lata.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/lateral_femoral_cutaneous/medicine2026_f5.webp',
    attribution: {
      title: "Regional anesthesia combined with esketamine analgesia and remimazolam sedation as a salvage strategy for intertrochanteric femur fracture surgery in a high-risk patient: A case report",
      authors: "Wang, Zhang, Ren et al.",
      journal: "Medicine",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13363337/",
      pmcid: "PMC13363337",
      figure: "Figura 5",
      caption: "Bloqueio do nervo cutâneo lateral da coxa: LFCN entre o tensor da fáscia lata (TFLM) e o sartório (SaM). Lateral à esquerda.",
    },
  },
  tags: ['meralgia parestésica', 'EIAS', 'sartório', 'tensor da fáscia lata', 'fáscia lata', 'coxa', 'membro inferior'],
};
