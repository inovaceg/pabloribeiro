/**
 * Artigos educativos do site.
 * Textos informativos e gerais — não substituem avaliação ou acompanhamento profissional.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** Rótulo curto exibido nos cards. */
  category: "Psicoterapia" | "TCC" | "Avaliação Neuropsicológica" | "Saúde emocional";
  readingMinutes: number;
  /** Data de publicação, formato AAAA-MM-DD. */
  published: string;
  related: "psicoterapia" | "avaliacao";
  body: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: "quando-procurar-um-psicologo",
    title: "Quando procurar um psicólogo?",
    description:
      "Não é preciso esperar uma crise para buscar ajuda. Veja sinais e situações em que o acompanhamento psicológico pode fazer diferença.",
    category: "Psicoterapia",
    readingMinutes: 4,
    published: "2026-11-05",
    related: "psicoterapia",
    body: [
      {
        type: "p",
        text: "Muitas pessoas ainda associam a psicoterapia apenas a momentos de crise. Mas o acompanhamento psicológico também é um espaço para se conhecer melhor, atravessar mudanças com mais clareza e desenvolver formas mais saudáveis de lidar com o que se sente.",
      },
      { type: "h2", text: "Alguns sinais que merecem atenção" },
      {
        type: "list",
        items: [
          "Tristeza, irritação ou preocupação que se prolongam e passam a afetar a rotina.",
          "Dificuldade para dormir, se concentrar ou realizar atividades que antes eram simples.",
          "Sensação de estar sobrecarregado, sem conseguir dar conta das demandas.",
          "Conflitos frequentes nos relacionamentos, em casa ou no trabalho.",
          "Perdas, separações, mudanças de cidade, de emprego ou outros momentos de transição.",
          "Vontade de compreender melhor a si mesmo, mesmo sem um problema específico.",
        ],
      },
      { type: "h2", text: "Não existe um “problema grande o suficiente”" },
      {
        type: "p",
        text: "É comum adiar a procura por ajuda por achar que outras pessoas passam por situações mais difíceis. O sofrimento não precisa ser comparado: se algo tem incomodado você, isso já é motivo suficiente para conversar com um profissional.",
      },
      { type: "h2", text: "E para crianças e adolescentes?" },
      {
        type: "p",
        text: "Mudanças de comportamento, dificuldades na escola, isolamento ou alterações no sono e na alimentação podem indicar que a criança ou o adolescente precisa de apoio. Nesses casos, a família costuma participar do processo, e o profissional orienta sobre o melhor caminho.",
      },
      { type: "h2", text: "Como dar o primeiro passo" },
      {
        type: "p",
        text: "O primeiro contato serve justamente para tirar dúvidas e entender se o acompanhamento faz sentido para você neste momento. Não é preciso chegar com tudo organizado — a conversa acontece no seu ritmo.",
      },
      {
        type: "p",
        text: "Em situações de emergência ou risco à vida, procure imediatamente o CVV (188, ligação gratuita, 24 horas), o SAMU (192) ou o pronto-atendimento mais próximo.",
      },
    ],
  },
  {
    slug: "o-que-e-terapia-cognitivo-comportamental",
    title: "O que é Terapia Cognitivo-Comportamental (TCC)?",
    description:
      "Entenda como a TCC trabalha a relação entre pensamentos, emoções e comportamentos, e como costuma ser o processo terapêutico.",
    category: "TCC",
    readingMinutes: 5,
    published: "2026-11-05",
    related: "psicoterapia",
    body: [
      {
        type: "p",
        text: "A Terapia Cognitivo-Comportamental, conhecida como TCC, é uma das abordagens da psicologia mais estudadas. Ela parte da ideia de que a forma como interpretamos as situações influencia o que sentimos e a maneira como agimos.",
      },
      { type: "h2", text: "Pensamentos, emoções e comportamentos" },
      {
        type: "p",
        text: "Diante de um mesmo acontecimento, duas pessoas podem reagir de formas muito diferentes. Isso acontece porque cada uma interpreta a situação a partir das próprias experiências e crenças. Na TCC, terapeuta e paciente investigam juntos esses padrões, especialmente os que geram sofrimento ou dificultam a vida.",
      },
      { type: "h2", text: "Como costuma ser o processo" },
      {
        type: "list",
        items: [
          "Compreensão da demanda: o que trouxe a pessoa até a terapia e o que ela deseja mudar.",
          "Definição de objetivos, construídos em conjunto e revistos ao longo do caminho.",
          "Identificação de pensamentos, emoções e comportamentos que se repetem.",
          "Desenvolvimento de estratégias práticas para lidar com as situações do dia a dia.",
          "Atividades entre as sessões, quando fazem sentido, para levar o que foi trabalhado para a rotina.",
        ],
      },
      { type: "h2", text: "Uma abordagem colaborativa" },
      {
        type: "p",
        text: "Na TCC, o paciente participa ativamente. O terapeuta não “dá respostas prontas”: ajuda a pessoa a observar a própria experiência com mais clareza e a construir alternativas que façam sentido para a sua vida.",
      },
      { type: "h2", text: "Para quem é indicada?" },
      {
        type: "p",
        text: "A TCC pode ser adaptada para pessoas de diferentes idades — crianças, adolescentes, adultos e idosos — e para demandas variadas, como ansiedade, tristeza persistente, dificuldades nos relacionamentos ou momentos de transição. A indicação é sempre avaliada individualmente, a partir da primeira conversa.",
      },
    ],
  },
  {
    slug: "para-que-serve-a-avaliacao-neuropsicologica",
    title: "Para que serve a Avaliação Neuropsicológica?",
    description:
      "Saiba o que é a avaliação neuropsicológica, quando ela costuma ser indicada e como funcionam as etapas do processo.",
    category: "Avaliação Neuropsicológica",
    readingMinutes: 5,
    published: "2026-11-05",
    related: "avaliacao",
    body: [
      {
        type: "p",
        text: "A avaliação neuropsicológica é um processo que investiga funções como atenção, memória, linguagem e funções executivas, e a relação delas com as emoções e o comportamento. O objetivo é compreender como a pessoa funciona — suas potencialidades e suas dificuldades.",
      },
      { type: "h2", text: "Quando ela costuma ser indicada" },
      {
        type: "list",
        items: [
          "Dificuldades de atenção, concentração ou organização no dia a dia.",
          "Queixas de memória, em qualquer fase da vida.",
          "Dificuldades de aprendizagem ou de desempenho escolar.",
          "Investigação de hipóteses como TDAH ou TEA, em conjunto com outros profissionais.",
          "Mudanças cognitivas percebidas pela própria pessoa ou pela família.",
          "Necessidade de orientar intervenções, adaptações escolares ou acompanhamento terapêutico.",
        ],
      },
      {
        type: "p",
        text: "Muitas vezes, a avaliação é solicitada por médicos, escolas ou outros profissionais de saúde. Mas a própria pessoa ou a família também pode buscá-la quando percebe alguma dificuldade.",
      },
      { type: "h2", text: "Como funciona o processo" },
      {
        type: "list",
        items: [
          "Entrevista inicial, para compreender a demanda e a história da pessoa avaliada.",
          "Sessões de avaliação, com tarefas e instrumentos escolhidos para cada caso.",
          "Análise e integração das informações obtidas.",
          "Devolutiva, em que os resultados são explicados com clareza e as orientações são discutidas.",
        ],
      },
      { type: "h2", text: "O que a avaliação não é" },
      {
        type: "p",
        text: "A avaliação neuropsicológica não é um teste rápido nem um “rótulo”. É um processo cuidadoso, que considera a pessoa como um todo e contribui para decisões mais bem fundamentadas sobre tratamento, estudo, trabalho e rotina.",
      },
    ],
  },
  {
    slug: "ansiedade-no-dia-a-dia",
    title: "Ansiedade no dia a dia: quando ela deixa de ajudar?",
    description:
      "A ansiedade faz parte da vida, mas pode se tornar excessiva. Entenda a diferença e conheça cuidados que ajudam no cotidiano.",
    category: "Saúde emocional",
    readingMinutes: 4,
    published: "2026-11-05",
    related: "psicoterapia",
    body: [
      {
        type: "p",
        text: "Sentir ansiedade antes de uma prova, de uma entrevista ou de uma decisão importante é natural. Ela funciona como um sinal de alerta que nos prepara para lidar com desafios. O problema começa quando essa resposta aparece com muita intensidade, com frequência ou sem um motivo claro.",
      },
      { type: "h2", text: "Sinais de que a ansiedade pode estar excessiva" },
      {
        type: "list",
        items: [
          "Preocupação constante e difícil de controlar.",
          "Tensão muscular, inquietação, coração acelerado ou falta de ar.",
          "Dificuldade para dormir ou para relaxar.",
          "Evitar situações, lugares ou pessoas por medo do que pode acontecer.",
          "Prejuízo nos estudos, no trabalho ou nos relacionamentos.",
        ],
      },
      { type: "h2", text: "Cuidados que ajudam no cotidiano" },
      {
        type: "list",
        items: [
          "Manter uma rotina de sono regular, na medida do possível.",
          "Praticar atividade física de forma consistente.",
          "Reduzir o excesso de cafeína e de estímulos, como telas antes de dormir.",
          "Reservar momentos de pausa ao longo do dia.",
          "Conversar sobre o que está sentindo com pessoas de confiança.",
        ],
      },
      {
        type: "p",
        text: "Esses cuidados ajudam, mas nem sempre são suficientes. Se a ansiedade tem atrapalhado a sua vida, buscar acompanhamento psicológico é um passo importante. Na psicoterapia, é possível compreender o que alimenta esse ciclo e desenvolver formas mais saudáveis de lidar com ele.",
      },
      {
        type: "p",
        text: "Este texto é informativo e não substitui avaliação profissional. Em situações de crise, procure o CVV (188) ou o SAMU (192).",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
