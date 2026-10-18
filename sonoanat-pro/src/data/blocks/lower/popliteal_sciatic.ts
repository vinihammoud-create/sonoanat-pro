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
  orientation: { left: 'LATERAL (bíceps femoral)', right: 'MEDIAL (semimembranoso)' },
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
      label: "M. bíceps femoral (lateral)",
      points: '71,247 285,280 293,527 71,544',
      label_pos: { x: 180, y: 400 },
      echo: "Parede muscular lateral da fossa poplítea.",
      note: "A agulha o atravessa na abordagem lateral.",
    },
    {
      id: 'pop-semimemb',
      type: 'muscle',
      label: "M. semimembranoso / semitendinoso (medial)",
      points: '648,198 928,181 928,494 664,494',
      label_pos: { x: 795, y: 340 },
      echo: "Parede muscular medial da fossa poplítea.",
      note: "Limite medial do campo.",
    },
    {
      id: 'pop-vloka',
      type: 'la_spread',
      label: "Bainha paraneural (Vloka) / alvo subparaneural",
      points: '285,354 615,359 631,453 582,511 302,508 269,428',
      label_pos: { x: 455, y: 362 },
      echo: "Envelope hiperecoico comum que envolve tibial e fibular comum na bifurcação.",
      note: "Injetar dentro da bainha, no septo entre os dois componentes, sem entrar no epineuro.",
    },
    {
      id: 'pop-cpn',
      type: 'nerve',
      label: "N. fibular comum (lateral)",
      points: '302,387 417,376 442,432 409,478 310,470',
      label_pos: { x: 372, y: 428 },
      echo: "Componente menor, em favo de mel, lateral.",
      note: "Seta CPN na figura.",
      alert: "Evitar injeção intraneural.",
    },
    {
      id: 'pop-tn',
      type: 'nerve',
      label: "N. tibial (medial)",
      points: '442,382 582,387 612,442 574,494 458,491',
      label_pos: { x: 525, y: 438 },
      echo: "Componente maior, medial, superficial aos vasos poplíteos.",
      note: "Seta TN na figura.",
      alert: "Resistência à injeção = recuar.",
    },
    {
      id: 'pop-artery',
      type: 'artery',
      label: "A. poplítea",
      points: '704,613 696,637 676,651 652,651 632,637 624,613 632,589 652,575 676,575 696,589',
      label_pos: { x: 664, y: 613 },
      echo: "Círculo anecoico pulsátil profundo e medial ao nervo (seta PA).",
      note: "Profunda ao nervo tibial; a veia fica entre eles.",
      alert: "Não avançar a agulha profundamente além do nervo.",
    },
    {
      id: 'pop-needle',
      type: 'needle',
      label: "Agulha em plano (lateral → medial)",
      points: '87,321 302,420',
      label_pos: { x: 190, y: 330 },
      note: "Entrada lateral através do bíceps femoral, mirando o septo entre os dois componentes.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/popliteal_sciatic/jcm2025_f2.webp',
    attribution: {
      title: "Perioperative Analgesia for Foot and Ankle Surgery: A Comprehensive Review",
      authors: "Pascarella, De Quattro, Strumia et al.",
      journal: "Journal of Clinical Medicine",
      year: "2025",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12429618/",
      pmcid: "PMC12429618",
      figure: "Figura 2",
      caption: "Bloqueio do ciático poplíteo: CPN nervo fibular comum; TN nervo tibial; PA artéria poplítea. Lateral à esquerda, medial à direita.",
    },
  },
  tags: ['ciático', 'poplíteo', 'bainha de Vloka', 'tibial', 'fibular comum', 'tornozelo', 'pé', 'membro inferior'],
};
