import type { Block } from '@/types';
import { MAX_DOSE_ROW } from '../shared';

export const espBlock: Block = {
  id: 'esp_block',
  categoryId: 'trunk_abdomen',
  name: 'Bloqueio do Plano do Eretor da Espinha (ESPB)',
  shortName: 'ESP (Eretor da Espinha)',
  subtitle: 'Parassagital em T5 • 3 cm lateral à linha média • plano profundo ao eretor da espinha',
  target: 'Ramos dorsais e ventrais dos nervos espinhais torácicos sob o músculo eretor da espinha',
  summary:
    'Aproximadamente 3 cm lateral à linha média (processos espinhosos), no plano parassagital. Localizar o processo transverso com sombra acústica: no corte parassagital ele aparece como estrutura hiperecoica de topo plano e contorno quadrado/romboide, mais profunda que a costela. O músculo eretor da espinha recobre o processo transverso; superficialmente a ele, em T5, veem-se o romboide maior e o trapézio. Entre dois processos transversos consecutivos ficam os músculos intertransversos e, mais profundamente, a linha pleural hiperecoica com deslizamento pulmonar.',
  orientation: { left: 'CAUDAL', right: 'CRANIAL' },
  ergonomics: {
    probe: 'Linear (em pacientes magros) ou curvo (em obesos ou no nível lombar)',
    depthCm: 4,
    depthText: '2,5 a 4,0 cm (até 6 cm em obesos)',
    patientPosition: 'Decúbito ventral, lateral ou sentado, com o dorso fletido para abrir os espaços intertransversos.',
    probePosition:
      'Transdutor em orientação parassagital (longitudinal), cerca de 3 cm lateral à linha média, no nível do processo espinhoso de T5 (contar a partir de C7 ou do ângulo inferior da escápula, que corresponde a T7). Varrer de medial para lateral: a partir das lâminas, o processo transverso surge como topo plano e quadrado; continuando lateralmente, aparecem as costelas, arredondadas e mais superficiais, com a pleura logo abaixo. Retornar medialmente até centralizar os processos transversos com o eretor da espinha sobre eles.',
    needleApproach:
      'Em plano, de cefálico para caudal (ou de caudal para cefálico), atravessando trapézio, romboide maior e eretor da espinha. Contatar o processo transverso com a ponta da agulha e injetar para dispersar o anestésico no plano fascial profundo ao eretor da espinha, deslocando o músculo para cima e abrindo o plano cefalocaudalmente.',
    needleTechnique: 'in-plane',
    tips: [
      'Hidrodissecção com 1 a 2 mL de soro confirma o plano correto: o eretor da espinha se eleva linearmente sobre o processo transverso, sem acúmulo intramuscular.',
      'A agulha deve tocar osso antes da injeção: o contato com o topo plano do processo transverso garante que a ponta está profunda ao eretor da espinha e distante da pleura.',
    ],
  },
  clinical: {
    indications: [
      'Fraturas de costela (analgesia uni ou bilateral)',
      'Toracotomia e cirurgia torácica videoassistida',
      'Cirurgia de coluna dorsal',
      'Cirurgias mamárias',
      'Cirurgias abdominais altas (ajustar o nível de punção para T7–T9)',
    ],
    doses: [
      { title: 'Analgesia (injeção única)', regimen: 'Ropivacaína 0,25% a 0,5%: 20 a 30 mL por lado' },
      {
        title: 'Volume e dispersão',
        regimen: 'Volume generoso (20 a 30 mL) é necessário para dispersão craniocaudal multissegmentar; 30 mL a 0,5% = 150 mg, por isso em bloqueios bilaterais ou pacientes de baixo peso diluir para 0,2% a 0,25% e respeitar a dose máxima',
      },
      MAX_DOSE_ROW,
    ],
    pearls: [
      'Identificar erroneamente a costela e a pleura como processo transverso: o processo transverso é mais quadrado/romboide, de topo plano, e a pleura não é visível imediatamente abaixo dele; a costela é arredondada, mais superficial e lateral, com a pleura logo abaixo.',
      'A pleura é mais profunda que o processo transverso: entre dois processos transversos ela aparece no fundo do espaço intertransverso. Manter a ponta da agulha sempre sobre o osso.',
      'Necessita volume generoso para dispersão multissegmentar: espera-se cobertura de 3 a 4 dermátomos acima e abaixo do ponto de injeção.',
      'Dispersão no eixo longo é o sinal de sucesso: a lente anecoica deve avançar cranial e caudalmente sob o eretor da espinha, sobre os processos transversos.',
      'Por ser um plano fascial distante do neuroeixo e de grandes vasos, é alternativa quando o bloqueio neuroaxial ou paravertebral é indesejável; em pacientes anticoagulados, seguir as diretrizes institucionais para bloqueios de plano profundo. Em coluna instrumentada, o material pode ocultar os processos transversos: puncionar em nível acima ou abaixo da instrumentação.',
    ],
    references: [
      {
        citation: 'Forero M, et al. The erector spinae plane block: a novel analgesic technique in thoracic neuropathic pain. Reg Anesth Pain Med. 2016;41(5):621-627.',
        doi: '10.1097/AAP.0000000000000451',
      },
      {
        citation: 'Kot P, et al. The erector spinae plane block: a review of current evidence and clinical applications. Anaesthesia. 2019;74(5):648-662.',
        doi: '10.1111/anae.14624',
      },
    ],
  },
  overlays: [
    {
      id: 'esp-trapezius',
      type: 'muscle',
      label: "M. trapézio / romboide",
      points: '0,56 1000,48 1000,185 0,201',
      label_pos: { x: 500, y: 120 },
      echo: "Camadas musculares superficiais ao eretor.",
      note: "A agulha as atravessa em trajeto raso.",
    },
    {
      id: 'esp-erector',
      type: 'muscle',
      label: "M. eretor da espinha",
      points: '0,209 1000,193 1000,411 0,403',
      label_pos: { x: 500, y: 300 },
      echo: "Ventre muscular volumoso sobre o processo transverso.",
      note: "O plano-alvo é sua face profunda, em contato com o PT.",
    },
    {
      id: 'esp-tp',
      type: 'bone',
      label: "Processo transverso T10",
      points: '387,468 629,460 661,726 355,726',
      label_pos: { x: 508, y: 600 },
      echo: "Estrutura hiperecoica de topo plano com sombra acústica.",
      note: "Toque o PT com a agulha e injete sobre ele (TP10 na figura).",
      alert: "Costela = redonda e mais superficial; pleura = mais profunda que o PT.",
    },
    {
      id: 'esp-la',
      type: 'la_spread',
      label: "Dispersão do AL sob o eretor",
      points: '0,403 387,419 839,476 387,492 0,468',
      label_pos: { x: 180, y: 440 },
      echo: "Lente anecoica tracejada que descola o eretor do PT (ropivacaína 0,375% 20 mL).",
      note: "Dispersão craniocaudal multissegmentar.",
    },
    {
      id: 'esp-needle',
      type: 'needle',
      label: "Agulha em plano (cranial → caudal)",
      points: '1000,153 250,424',
      label_pos: { x: 640, y: 260 },
      note: "Entrada cranial (direita da imagem), em ângulo raso, até tocar o processo transverso.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/esp_block/frontiers2026_f1b.webp',
    attribution: {
      title: "Postoperative analgesic efficacy of intertransverse process block vs. erector spinae plane block in total laparoscopic hysterectomy: a randomized double-blind trial",
      authors: "Zeng, Chen, Peng et al.",
      journal: "Frontiers in Medicine",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13279586/",
      pmcid: "PMC13279586",
      figure: "Figura 1, painel B",
      caption: "Bloqueio do plano do eretor da espinha com transdutor linear: agulha em plano e dispersão de ropivacaína 0,375% (20 mL) sobre o processo transverso T10. Posterior no topo; cranial à direita.",
    },
  },
  tags: ['ESP', 'eretor da espinha', 'processo transverso', 'fratura de costela', 'toracotomia', 'mama', 'coluna torácica', 'plano fascial'],
};
