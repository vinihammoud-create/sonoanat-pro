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
      id: 'lfc-fascia-lata',
      type: 'fascia',
      label: 'Fáscia lata',
      points: '0,168 150,163 300,166 450,172 490,178 530,172 700,164 850,162 1000,166',
      label_pos: { x: 760, y: 142 },
      echo: 'Linha hiperecoica contínua que cobre os dois músculos e mergulha levemente no sulco entre eles.',
      note: 'Plano a ser atravessado pela agulha: o anestésico deve ficar imediatamente profundo a esta linha.',
    },
    {
      id: 'lfc-muscle-tfl',
      type: 'muscle',
      label: 'M. tensor da fáscia lata',
      points: '0,190 280,183 400,200 440,235 450,330 440,470 410,600 180,600 0,570',
      label_pos: { x: 200, y: 390 },
      echo: 'Ventre muscular hipoecoico com estriações hiperecoicas, lateral ao sulco.',
      note: 'Limite lateral do sulco adiposo; origina-se na EIAS e na crista ilíaca.',
    },
    {
      id: 'lfc-muscle-sartorius',
      type: 'muscle',
      label: 'M. sartório',
      points: '534,215 560,188 760,182 1000,190 1000,540 780,560 600,540 528,400 528,290',
      label_pos: { x: 760, y: 370 },
      echo: 'Banda muscular hipoecoica oblíqua, medial ao sulco, cruzando a coxa de lateral para medial.',
      note: 'Limite medial do sulco; mais caudalmente o nervo passa a correr sobre a sua face superficial.',
    },
    {
      id: 'lfc-muscle-deep',
      type: 'muscle',
      label: 'M. reto femoral / iliopsoas',
      points: '0,610 190,612 420,612 470,560 610,552 790,572 1000,552 1000,750 0,750',
      label_pos: { x: 500, y: 670 },
      echo: 'Camada muscular profunda, hipoecoica, abaixo do sartório e do tensor da fáscia lata.',
      note: 'Plano profundo demais: injeção aqui falha o bloqueio e pode envolver o nervo femoral.',
    },
    {
      id: 'lfc-la-spread',
      type: 'la_spread',
      label: 'Dispersão do AL',
      points: '428,222 446,204 472,194 510,193 522,205 528,222 522,240 510,251 472,252 446,243',
      label_pos: { x: 448, y: 236 },
      echo: 'Lente anecoica que separa a fáscia lata do sulco adiposo e envolve o nervo.',
      note: 'Pequeno volume (5 a 8 mL) sob a fáscia lata; a dispersão deve circundar o nervo, não os músculos.',
    },
    {
      id: 'lfc-nerve',
      type: 'nerve',
      label: 'N. cutâneo lateral da coxa',
      points: '512,220 509,227 501,232 490,234 479,232 471,227 468,220 471,213 479,208 490,206 501,208 509,213',
      label_pos: { x: 490, y: 220 },
      echo: 'Pequeno oval hipoecoico com halo hiperecoico, no sulco adiposo entre o tensor da fáscia lata e o sartório, sob a fáscia lata.',
      note: 'Pode estar sobre o sartório ou entre o sartório e o tensor da fáscia lata; o trajeto varia em relação à EIAS.',
      alert: 'Nervo pequeno e superficial: parestesia ou resistência à injeção indica posição intraneural; recuar a agulha.',
    },
    {
      id: 'lfc-needle',
      type: 'needle',
      label: 'Agulha em plano (lateral → medial)',
      points: '40,100 465,215',
      label_pos: { x: 240, y: 135 },
      note: 'Trajeto raso de lateral para medial; a ponta atravessa a fáscia lata e para no sulco adiposo, lateral ao nervo.',
    },
  ],
  images: { mode: 'C' },
  tags: ['meralgia parestésica', 'EIAS', 'sartório', 'tensor da fáscia lata', 'fáscia lata', 'coxa', 'membro inferior'],
};
