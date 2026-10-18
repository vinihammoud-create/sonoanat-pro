import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const poplitealSciatic: Block = {
  id: 'popliteal_sciatic',
  categoryId: 'lower_extremity',
  name: 'Bloqueio do Nervo Ciático na Fossa Poplítea',
  shortName: 'Ciático poplíteo',
  subtitle: 'Fossa poplítea ao nível da bifurcação (bainha paraneural de Vloka)',
  target: 'Nervo ciático antes da bifurcação nos nervos tibial e fibular comum, dentro da bainha paraneural comum',
  summary:
    'Visualizar os vasos poplíteos na fossa poplítea e localizar os nervos tibial e fibular comum que se unem em direção proximal para formar o nervo ciático (normalmente 5–10 cm acima da prega poplítea). O nervo tibial é o componente maior e medial, situado superficialmente à veia e à artéria poplíteas; o fibular comum é menor e lateral. Ambos aparecem como estruturas hiperecoicas em "favo de mel", envolvidas pela bainha paraneural comum (bainha de Vloka), entre o bíceps femoral (lateral) e o semimembranoso/semitendinoso (medial), com o fêmur hiperecoico no plano profundo.',
  orientation: { left: 'LATERAL (BÍCEPS FEMORAL)', right: 'MEDIAL (SEMIMEMBRANOSO)' },
  ergonomics: {
    probe: 'Linear de alta frequência (8–14 MHz)',
    depthCm: 4,
    depthText: '2,5 a 4,5 cm',
    patientPosition:
      'Decúbito dorsal com perna elevada em apoio (aberta lateralmente) ou decúbito ventral; o decúbito lateral também é possível.',
    probePosition:
      'Transversal na prega poplítea identificando a artéria poplítea, deslizando cranialmente 5–7 cm até o ponto exato onde o nervo tibial e o nervo fibular comum se fundem dentro da bainha de Vloka. Varrer proximal e distalmente para confirmar a bifurcação e inclinar o transdutor (tilting) para reduzir a anisotropia.',
    needleApproach:
      'Em plano (in-plane), de lateral para medial através do músculo bíceps femoral, ou fora de plano. A agulha é inserida dentro da bainha de Vloka (fáscia comum do ciático), com a ponta no septo entre o nervo tibial e o nervo fibular comum, sem penetrar o epineuro de nenhum dos componentes.',
    needleTechnique: 'both',
    tips: [
      'Em decúbito dorsal, apoie a perna elevada para que o transdutor seja posicionado por baixo, na face posterior do joelho, com espaço para a agulha entrar pela face lateral da coxa.',
      'Comece pela artéria poplítea na prega e siga o nervo tibial proximalmente até vê-lo se juntar ao fibular comum: esse é o nível ideal de injeção.',
    ],
  },
  clinical: {
    indications: [
      'Cirurgias de tornozelo, pé e tendão de Aquiles (associar bloqueio do nervo safeno no canal dos adutores para cobertura medial)',
      'Cirurgias de perna distal, como fraturas bimaleolares',
      'Amputações transmetatarsianas e desbridamentos',
    ],
    doses: [
      {
        title: 'Anestesia cirúrgica / analgesia prolongada',
        regimen: 'Ropivacaína 0,5% ou levobupivacaína 0,375%–0,5%: 20 mL dentro da bainha de Vloka',
      },
      {
        title: 'Alternativa',
        regimen: 'Ropivacaína 0,375%–0,5% ou bupivacaína 0,375%: 15 a 20 mL',
      },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'A injeção subparaneural (dentro da bainha de Vloka, no septo entre o nervo tibial e o nervo fibular comum, sem injetar intraneural!) produz o sinal do "olho de boi" e reduz o tempo de latência em 40%.',
      'Faça o tilting (inclinação caudal-cranial) do transdutor para corrigir a anisotropia e iluminar o nervo ciático.',
      'Bloquear apenas um dos ramos: ocorre se a injeção for realizada abaixo da bifurcação sem abordar ambos os nervos.',
      'Injeção intraneural com alta pressão: resistência elevada ou edema do nervo exigem recuar a agulha imediatamente.',
    ],
    references: [
      {
        citation:
          'Prasad A, et al. Ultrasound-guided popliteal sciatic nerve block: a comparison of catheter insertion techniques. Reg Anesth Pain Med. 2010;35(4):379-383.',
        doi: '10.1097/AAP.0b013e3181e82efd',
      },
    ],
  },
  overlays: [
    {
      id: 'pop-biceps',
      type: 'muscle',
      label: 'M. bíceps femoral (lateral)',
      points: '80,180 200,170 340,220 345,360 320,510 200,520 80,500 70,340',
      label_pos: { x: 205, y: 350 },
      echo: 'Ventre muscular hipoecoico com estriações fasciais hiperecoicas.',
      note: 'Parede muscular lateral da fossa poplítea; a agulha em plano atravessa este músculo.',
    },
    {
      id: 'pop-semimemb',
      type: 'muscle',
      label: 'M. semimembranoso / semitendinoso',
      points: '650,210 780,190 910,185 920,340 910,505 790,520 670,510 655,360',
      label_pos: { x: 780, y: 350 },
      echo: 'Ventre muscular hipoecoico com septos hiperecoicos, medial aos vasos.',
      note: 'Parede muscular medial da fossa poplítea.',
    },
    {
      id: 'pop-vloka',
      type: 'la_spread',
      label: 'Bainha de Vloka (alvo subparaneural)',
      points: '495,246 559,256 606,282 623,318 606,354 559,380 495,390 431,380 384,354 367,318 384,282 431,256',
      label_pos: { x: 495, y: 262 },
      echo: 'Envelope hiperecoico fino ao redor dos dois componentes; após a injeção, halo anecoico circunferencial ("olho de boi").',
      note: 'Envelope paraneural comum envolvendo os componentes tibial e fibular comum na bifurcação.',
    },
    {
      id: 'pop-cpn',
      type: 'nerve',
      label: 'N. fibular comum (lateral)',
      points: '438,280 463,287 478,306 478,330 463,349 438,356 413,349 398,330 398,306 413,287',
      label_pos: { x: 438, y: 318 },
      echo: 'Estrutura hiperecoica arredondada em "favo de mel", menor que o tibial.',
      note: 'Componente menor e mais lateral da bifurcação ciática.',
      alert: 'Evitar injeção intraneural: a ponta da agulha deve ficar no septo, fora do epineuro.',
    },
    {
      id: 'pop-tn',
      type: 'nerve',
      label: 'N. tibial (medial)',
      points: '548,275 572,281 590,297 596,318 590,340 572,355 548,361 524,355 506,340 500,318 506,297 524,281',
      label_pos: { x: 548, y: 318 },
      echo: 'Estrutura hiperecoica oval em "favo de mel", com anisotropia marcada.',
      note: 'Componente maior e mais medial, situado superficialmente à veia e artéria poplíteas.',
      alert: 'Injeção intraneural com alta pressão: resistência ou edema do nervo = recuar a agulha.',
    },
    {
      id: 'pop-vein',
      type: 'vein',
      label: 'V. poplítea',
      points: '530,406 557,412 574,429 574,451 557,468 530,474 503,468 486,451 486,429 503,412',
      label_pos: { x: 530, y: 440 },
      echo: 'Estrutura anecoica compressível, sem pulsatilidade.',
      note: 'Situada entre o nervo tibial (superficial) e a artéria poplítea (profunda).',
    },
    {
      id: 'pop-artery',
      type: 'artery',
      label: 'A. poplítea',
      points: '530,494 553,499 569,513 575,532 569,551 553,565 530,570 508,565 491,551 485,532 491,513 508,499',
      label_pos: { x: 530, y: 532 },
      echo: 'Estrutura anecoica arredondada, pulsátil e não compressível.',
      note: 'Estrutura pulsátil mais profunda, próxima à superfície posterior do fêmur.',
      alert: 'Punção vascular: aspirar antes de injetar e usar Doppler colorido em caso de dúvida.',
    },
    {
      id: 'pop-femur',
      type: 'bone',
      label: 'Fêmur (sombra acústica)',
      points: '250,750 250,660 330,632 450,620 550,618 650,622 740,640 800,668 800,750',
      label_pos: { x: 525, y: 690 },
      echo: 'Linha hiperecoica curva com sombra acústica posterior.',
      note: 'Limite profundo da fossa poplítea; os vasos repousam sobre a face posterior do fêmur.',
    },
    {
      id: 'pop-needle',
      type: 'needle',
      label: 'Agulha em plano (septo subparaneural)',
      points: '90,165 490,288',
      label_pos: { x: 260, y: 197 },
      note: 'Entrada lateral através do bíceps femoral, passando superficialmente ao nervo fibular comum sem tocá-lo; ponta no septo entre o fibular comum e o tibial, dentro da bainha de Vloka.',
    },
  ],
  images: { mode: 'C' },
  tags: ['ciático', 'poplíteo', 'bainha de Vloka', 'tibial', 'fibular comum', 'tornozelo', 'pé', 'membro inferior'],
};
