import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const vascularAccess: Block = {
  id: 'vascular_access',
  categoryId: 'pocus_sonoanatomy',
  name: 'Acesso Venoso Central Guiado (Veia Jugular Interna)',
  shortName: 'Acesso VJI',
  subtitle: 'Pescoço médio • ápice do triângulo de Sedillot • eixo curto da veia jugular interna',
  target: 'Veia jugular interna (VJI) no ápice do triângulo de Sedillot',
  summary:
    'Visualização transversal da artéria carótida (redonda, pulsátil, paredes espessas, não compressível) e da veia jugular interna (lateral, ovalada, compressível, fluxo venoso ao Doppler). A VJI situa-se superficial e lateral à carótida, sob o músculo esternocleidomastoideo; o nervo vago aparece como uma pequena estrutura arredondada em favo de mel, posterior e entre os dois vasos, dentro da bainha carotídea. Medialmente, a tireoide é vista como parênquima homogêneo de ecogenicidade média; lateral e profundo, o escaleno anterior com o nervo frênico em sua superfície. A pleura apical é a linha hiperecoica brilhante no limite profundo da imagem quando a varredura desce em direção à clavícula.',
  orientation: { left: 'CRANIAL (eixo longo)', right: 'CAUDAL' },
  ergonomics: {
    probe: 'Linear de alta frequência (10–15 MHz) em capa estéril.',
    depthCm: 3,
    depthText: '2 a 4 cm',
    patientPosition:
      'Trendelenburg leve a moderado para ingurgitamento venoso, cabeça rodada suavemente (<30° para evitar colapso venoso e sobreposição da VJI sobre a carótida).',
    probePosition:
      'Transversal (eixo curto) no pescoço médio, no ápice do triângulo de Sedillot (entre as cabeças esternal e clavicular do esternocleidomastoideo), com o marcador do transdutor voltado para o lado lateral. Varrer cranialmente e caudalmente ao longo da bainha carotídea para escolher o ponto em que a VJI está mais calibrosa e lateral à carótida, sem sobreposição; girar 90° para o eixo longo ao confirmar a posição do fio-guia.',
    needleApproach:
      'Fora de plano (eixo curto) ou em plano (eixo longo). Confirmação dinâmica do avanço da ponta da agulha perfurando a parede anterior da veia. No eixo curto, a agulha entra no ponto médio da borda longa do transdutor, perpendicular ao plano de imagem, a 30–45°, e a ponta surge como um ponto hiperecoico; avançar em passos curtos, inclinando o transdutor para acompanhar a ponta. No eixo longo, toda a haste é vista entrando no lúmen venoso.',
    needleTechnique: 'both',
    tips: [
      'Aplique a mínima pressão necessária sobre o transdutor: a VJI colapsa facilmente e a carótida permanece aberta por baixo dela.',
      'Pressão leve, Valsalva ou Trendelenburg distinguem veia (colapsa / distende) de artéria (não compressível, pulsátil).',
      'Antes de dilatar, confirme o fio-guia no interior do lúmen venoso em eixo longo e, se houver dúvida, em eixo curto.',
    ],
  },
  clinical: {
    indications: [
      'Cateterização venosa central segura',
      'Monitorização hemodinâmica (pressão venosa central, cateter de artéria pulmonar)',
      'Infusão de drogas vasoativas e soluções irritantes',
    ],
    doses: [
      { title: 'Infiltração de pele e subcutâneo', regimen: 'Lidocaína 1% a 2%: 2 a 5 mL no ponto de punção e no trajeto da agulha' },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Compressão excessiva pelo transdutor pode colapsar a veia e levar à transfixação e punção acidental da artéria carótida.',
      'Confirmar a passagem do fio-guia no interior do lúmen venoso em eixo longo antes da dilatação.',
      'A VJI colapsa com a pressão do transdutor e com a inspiração; Valsalva e Trendelenburg aumentam seu calibre e facilitam a punção.',
      'Rotação cefálica exagerada (>30°) desloca a VJI para cima da carótida, aumentando o risco de transfixação e punção arterial.',
      'Punção muito baixa, próxima à clavícula, aproxima a agulha da cúpula pleural: risco de pneumotórax. Prefira o ápice do triângulo de Sedillot.',
      'No eixo curto a imagem mostra apenas um corte da agulha: o que parece ser a ponta pode ser a haste, com a ponta já além do plano. Avance em passos e reposicione o transdutor a cada avanço.',
      'Trombo ou calibre diminuto da VJI são razões para mudar de lado ou de sítio antes da punção.',
    ],
    references: [
      {
        citation:
          'Troianos CA, et al. Guidelines for performing ultrasound-guided vascular cannulation: recommendations of the American Society of Echocardiography and the Society of Cardiovascular Anesthesiologists. Anesth Analg. 2012;114(1):46-72.',
        doi: '10.1213/ANE.0b013e3182407cd8',
      },
    ],
  },
  overlays: [
    {
      id: 'vj-scm',
      type: 'muscle',
      label: "M. esternocleidomastoideo",
      points: '258,98 799,98 799,239 258,232',
      label_pos: { x: 528, y: 168 },
      echo: "Camada muscular superficial à veia.",
      note: "A agulha o atravessa; janela de punção no ápice do triângulo de Sedillot.",
    },
    {
      id: 'vj-ijv',
      type: 'vein',
      label: "V. jugular interna (eixo longo)",
      points: '392,251 794,273 799,366 392,342 375,293',
      label_pos: { x: 600, y: 308 },
      echo: "Faixa anecoica superficial, compressível, com ponto de colapso (seta).",
      note: "Varia com a respiração e a posição; Trendelenburg aumenta o calibre.",
      alert: "Transfixação: a carótida fica logo abaixo.",
    },
    {
      id: 'vj-ica',
      type: 'artery',
      label: "A. carótida interna (eixo longo)",
      points: '306,371 799,366 799,517 306,525',
      label_pos: { x: 552, y: 445 },
      echo: "Faixa anecoica profunda, pulsátil, não compressível, de paredes espessas (ICA).",
      note: "Confirmar com Doppler antes de puncionar.",
      alert: "Punção arterial: hematoma e AVC. Nunca dilatar sem confirmar o fio-guia na veia.",
    },
    {
      id: 'vj-needle',
      type: 'needle',
      label: "Agulha em plano (eixo longo)",
      points: '209,73 404,256',
      label_pos: { x: 280, y: 120 },
      note: "No eixo longo a haste inteira é visível entrando na parede anterior da veia; no eixo curto (fora de plano), avançar em passos seguindo a ponta.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/vascular_access/jci2026_f2a.webp',
    attribution: {
      title: "Point-of-care ultrasound to evaluate volume status in congestive heart failure",
      authors: "Shaul, Smeltz, Raff et al.",
      journal: "Journal of Cardiovascular Imaging",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13343992/",
      pmcid: "PMC13343992",
      figure: "Figura 2, painel A",
      caption: "Veia jugular interna (IJV) e artéria carótida interna (ICA) no eixo longo; a seta marca o ponto de colapso venoso.",
    },
  },
  tags: ['acesso venoso central', 'jugular interna', 'VJI', 'carótida', 'triângulo de Sedillot', 'cateter venoso', 'eixo curto', 'POCUS'],
};
