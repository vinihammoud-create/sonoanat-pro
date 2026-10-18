import type { Block } from '@/types';

export const gastricUltrasound: Block = {
  id: 'gastric_ultrasound',
  categoryId: 'pocus_sonoanatomy',
  name: 'Avaliação do Antro Gástrico por Ultrassom',
  shortName: 'Antro gástrico',
  subtitle: 'Plano sagital epigástrico • avaliação qualitativa e quantitativa do conteúdo gástrico',
  target: 'Antro gástrico na região epigástrica / parassagital direita, entre o lobo esquerdo do fígado e o pâncreas',
  summary:
    'No plano parassagital epigástrico identificam-se, de anterior para posterior: lobo esquerdo do fígado, antro gástrico, pâncreas, artéria mesentérica superior e aorta (ou veia cava inferior, mais à direita), repousando sobre o corpo vertebral. O antro situa-se entre o fígado e o pâncreas e, em jejum, apresenta parede com cinco camadas e submucosa/muscular espessas, colabado sobre si mesmo ("olho de boi"). Conteúdo líquido distende o antro com lúmen anecoico/hipoecoico; conteúdo sólido produz padrão heterogêneo com sombra acústica suja.',
  orientation: { left: 'CRANIAL (fígado)', right: 'CAUDAL' },
  ergonomics: {
    probe: 'Curvo de baixa frequência (2–5 MHz)',
    depthCm: 8,
    depthText: '6 a 10 cm (transdutor convexo)',
    patientPosition:
      'Decúbito dorsal seguido obrigatoriamente por decúbito lateral direito (DLD), posição em que o conteúdo gravita para o antro e a sensibilidade do exame é máxima.',
    probePosition:
      'Transdutor curvo no epigástrio, em plano sagital/parassagital direito, com o marcador voltado para cranial (fígado à esquerda da tela). Varrer da linha média para a direita e caudalmente, inclinando o feixe até obter o corte transversal do antro anterior ao pâncreas, com a aorta no plano (nível padronizado de Perlas para medir a área); a veia cava inferior, um pouco mais à direita, é referência alternativa. Repetir a mesma janela em DLD.',
    needleApproach: 'Não invasivo / diagnóstico.',
    needleTechnique: 'none',
    tips: [
      'Medir a área antral em DLD, entre contrações peristálticas, traçando a serosa externa (incluindo a parede); volume estimado (mL) = 27,0 + 14,6 × área (cm²) − 1,28 × idade (anos).',
      'Área antral > 340 mm² ou volume > 1,5 mL/kg em DLD sugere estômago cheio em adulto não gestante.',
    ],
  },
  clinical: {
    indications: [
      'Determinação do status gástrico de jejum em cirurgias de urgência e emergência',
      'Pacientes com esvaziamento gástrico retardado (diabetes, gestação, obesidade, opioides, doença renal crônica)',
      'Avaliação do risco de broncoaspiração quando o tempo de jejum é incerto ou não confiável',
    ],
    doses: [
      { title: 'Anestésico local', regimen: 'Não se aplica (exame diagnóstico)' },
    ],
    pearls: [
      'Classificação qualitativa de Perlas: Grau 0 (antro vazio em supino e DLD = estômago vazio); Grau 1 (conteúdo líquido visível apenas em DLD = volume baixo habitual); Grau 2 (líquido visível em supino e DLD = estômago cheio, alto risco).',
      'Conteúdo sólido ou semissólido: aparência mista com sombra acústica suja = alto risco imediato de broncoaspiração.',
      'Líquido claro recém-ingerido aparece anecoico e pode conter bolhas de ar ("céu estrelado") nos primeiros minutos; leite ou líquidos espessos são hiperecoicos e homogêneos.',
      'A aorta (pulsátil) e a veia cava inferior (compressível, à direita) são as referências posteriores que confirmam o corte correto do antro; o pâncreas fica interposto entre o antro e os vasos.',
      'Medir sempre entre contrações peristálticas, pois a área varia ao longo do ciclo; usar a média de 2 a 3 medidas.',
    ],
    references: [
      {
        citation: 'Perlas A, et al. Validation of a mathematical model for ultrasound assessment of gastric volume by gastroscopy. Anesth Analg. 2013;116(2):357-363.',
        doi: '10.1213/ANE.0b013e318274d445',
      },
      {
        citation: 'Van de Putte P, Perlas A. Ultrasound assessment of gastric content and volume. Br J Anaesth. 2014;113(1):12-22.',
        doi: '10.1093/bja/aeu151',
      },
    ],
  },
  overlays: [
    {
      id: 'ga-wall',
      type: 'muscle',
      label: "Parede abdominal (reto / linha alba)",
      points: '333,28 736,21 736,83 333,90',
      label_pos: { x: 535, y: 55 },
      echo: "Camadas superficiais da parede epigástrica.",
      note: "Janela acústica para o antro.",
    },
    {
      id: 'ga-liver',
      type: 'organ',
      label: "Fígado (lobo esquerdo)",
      points: '333,83 709,83 792,250 431,257 292,167',
      label_pos: { x: 540, y: 170 },
      echo: "Parênquima homogêneo de ecogenicidade média, anterior ao antro.",
      note: "Referência anterior/cranial do antro no corte sagital.",
    },
    {
      id: 'ga-antrum',
      type: 'organ',
      label: "Antro gástrico (parede)",
      points: '729,403 706,469 643,523 551,552 449,552 357,523 294,469 271,403 294,337 357,283 449,254 551,254 643,283 706,337',
      label_pos: { x: 500, y: 265 },
      echo: "Anel de 5 camadas com a muscular própria hipoecoica espessa.",
      note: "Medir a área de secção transversa (ACT) no plano sagital, em decúbito lateral direito, entre as contrações (setas amarelas = diâmetros).",
    },
    {
      id: 'ga-lumen',
      type: 'organ',
      label: "Conteúdo do antro (líquido)",
      points: '667,403 650,448 604,484 537,504 463,504 396,484 350,448 333,403 350,358 396,322 463,302 537,302 604,322 650,358',
      label_pos: { x: 500, y: 403 },
      echo: "Conteúdo anecoico/hipoecoico: líquido claro (grau de Perlas 2 se também visível em supino).",
      note: "Vazio = \"olho de boi\" colabado; sólido = heterogêneo com sombra \"suja\".",
      alert: "Líquido visível em supino e DLD ou conteúdo sólido = estômago cheio: alto risco de broncoaspiração.",
    },
    {
      id: 'ga-retro',
      type: 'organ',
      label: "Pâncreas / retroperitônio",
      points: '278,556 792,549 847,625 222,632',
      label_pos: { x: 535, y: 592 },
      echo: "Faixa ecogênica posterior ao antro.",
      note: "A aorta e a veia mesentérica superior ficam posteriores, como referências profundas.",
    },
  ],
  images: {
    mode: 'A',
    baseUrl: 'images/real/gastric_ultrasound/ochsner2026_f3.webp',
    attribution: {
      title: "Benefits of Point-of-Care Ultrasound for Assessing Gastric Contents",
      authors: "Koveleskie, Labat, Palascak et al.",
      journal: "The Ochsner Journal",
      year: "2026",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13577648/",
      pmcid: "PMC13577648",
      figure: "Figura 3",
      caption: "Área de secção transversa do antro em corte sagital, paciente em decúbito lateral direito; as linhas amarelas são os diâmetros medidos pelo ultrassom.",
    },
  },
  tags: ['antro gástrico', 'estômago cheio', 'jejum', 'broncoaspiração', 'Perlas', 'POCUS', 'volume gástrico'],
};
