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
      id: 'sc-muscle-ant',
      type: 'muscle',
      label: 'M. escaleno anterior',
      points: '560,260 720,310 680,450 545,420',
      label_pos: { x: 640, y: 350 },
      echo: 'Ventre muscular hipoecoico com estriações fasciais hiperecoicas.',
      note: 'Insere-se no tubérculo de Lisfranc na 1ª costela, imediatamente anterior à artéria subclávia.',
    },
    {
      id: 'sc-muscle-med',
      type: 'muscle',
      label: 'M. escaleno médio',
      points: '110,270 300,310 310,510 110,500',
      label_pos: { x: 205, y: 400 },
      echo: 'Ventre muscular hipoecoico lateral ao plexo.',
      note: 'Referência muscular lateral através da qual a agulha avança na abordagem em plano.',
    },
    {
      id: 'sc-artery',
      type: 'artery',
      label: 'A. subclávia',
      points: '475,390 545,405 565,465 535,525 465,530 435,475 445,415',
      label_pos: { x: 500, y: 465 },
      echo: 'Estrutura anecoica arredondada, pulsátil e não compressível.',
      note: 'Repousa diretamente sobre a 1ª costela; é a referência central do bloqueio.',
      alert: 'Não avançar a agulha medialmente além da artéria: risco de punção vascular e pleural.',
    },
    {
      id: 'sc-plexus',
      type: 'nerve',
      label: 'Plexo braquial (cluster)',
      points: '310,305 415,320 440,395 425,495 340,505 295,415',
      label_pos: { x: 368, y: 395 },
      echo: 'Múltiplos nódulos hipoecoicos agrupados ("cacho de uvas").',
      note: 'Troncos e divisões situados posterolateralmente à artéria subclávia.',
      alert: 'Evitar injeção intraneural: resistência alta ou edema do nervo = recuar a agulha.',
    },
    {
      id: 'sc-la-spread',
      type: 'la_spread',
      label: 'Corner pocket (dispersão AL)',
      points: '355,485 435,475 465,530 345,532',
      label_pos: { x: 395, y: 508 },
      echo: 'Coleção anecoica que hidrodisseca o tronco inferior para cima.',
      note: 'Depósito de anestésico local no corner pocket, entre a artéria e a 1ª costela.',
    },
    {
      id: 'sc-rib',
      type: 'bone',
      label: '1ª costela (sombra acústica)',
      points: '250,535 595,535 595,570 250,570',
      label_pos: { x: 420, y: 553 },
      echo: 'Linha hiperecoica brilhante com sombra acústica posterior enegrecida.',
      note: 'Atua como barreira de segurança entre a agulha e a pleura.',
    },
    {
      id: 'sc-pleura',
      type: 'pleura',
      label: 'Pleura parietal / pulmão',
      points: '605,515 860,545 860,575 605,545',
      label_pos: { x: 735, y: 545 },
      echo: 'Linha hiperecoica com deslizamento pulmonar (lung sliding) e artefatos em cauda de cometa.',
      note: 'Medial e profunda à 1ª costela.',
      alert: 'Risco de pneumotórax: manter a ponta da agulha sempre visível e lateral à artéria.',
    },
    {
      id: 'sc-needle',
      type: 'needle',
      label: 'Agulha em plano (alvo: corner pocket)',
      points: '85,205 395,512',
      label_pos: { x: 230, y: 310 },
      note: 'Entrada lateral para medial em ângulo raso, mantendo visualização contínua de toda a haste e do bisel.',
    },
  ],
  images: { mode: 'C' },
  tags: ['plexo braquial', 'corner pocket', 'membro superior', 'mão', 'antebraço', 'cotovelo'],
};
