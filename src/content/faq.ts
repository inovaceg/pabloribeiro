import { site, hasText } from "@/config/site";

export type FaqItem = { q: string; a: string };

const duration = hasText(site.sessions.duration)
  ? `As sessões têm duração aproximada de ${site.sessions.duration}. A frequência é combinada de acordo com as necessidades de cada pessoa.`
  : "A duração e a frequência das sessões são combinadas de acordo com a necessidade de cada pessoa. Para informações atualizadas, entre em contato.";

export const FAQ: FaqItem[] = [
  {
    q: "Como funciona a primeira consulta?",
    a: "A primeira consulta é um momento de acolhimento e escuta. Conversamos sobre o que motivou a busca por atendimento, suas expectativas e sua história, e eu explico como funciona o acompanhamento. É também uma oportunidade para você tirar dúvidas e perceber se se sente à vontade para seguir com o processo.",
  },
  {
    q: "Como posso agendar?",
    a: "O agendamento é feito diretamente comigo pelo WhatsApp — pelos botões “Agendar” disponíveis em todas as páginas ou pelo formulário de contato. Retorno o mais breve possível com as opções de dia e horário.",
  },
  {
    q: "O atendimento pode ser realizado online?",
    a: "Sim. Além do atendimento presencial em Juiz de Fora – MG, ofereço sessões online, por videochamada, com o mesmo cuidado ético e sigilo do atendimento presencial. Basta ter uma conexão estável e um ambiente reservado.",
  },
  {
    q: "Qual a duração das sessões?",
    a: duration,
  },
  {
    q: "Quais são os valores? Atende convênio?",
    a: [
      hasText(site.sessions.pricing) ? `${site.sessions.pricing}.` : "",
      hasText(site.sessions.insurance)
        ? `${site.sessions.insurance}.`
        : "Valores, formas de pagamento e informações sobre convênios são passados diretamente pelo WhatsApp, no momento do agendamento.",
    ]
      .filter(Boolean)
      .join(" "),
  },
  {
    q: "Como funciona a Terapia Cognitivo-Comportamental?",
    a: "A TCC é uma abordagem que investiga a relação entre pensamentos, emoções e comportamentos. Em conjunto, terapeuta e paciente identificam padrões que geram sofrimento e constroem estratégias práticas para lidar com eles. É uma abordagem colaborativa, estruturada e com objetivos definidos ao longo do processo.",
  },
  {
    q: "O que é Avaliação Neuropsicológica?",
    a: "É um processo de investigação das funções cognitivas — como atenção, memória, linguagem, funções executivas — e de aspectos emocionais e comportamentais. Ela contribui para compreender o funcionamento de cada pessoa, auxiliar diagnósticos realizados por equipes de saúde e orientar intervenções.",
  },
  {
    q: "Como funciona o processo de avaliação?",
    a: "O processo envolve uma entrevista inicial, sessões de avaliação com instrumentos adequados a cada caso, análise dos resultados e uma sessão de devolutiva. Número de sessões, prazos e detalhes variam conforme a demanda — entre em contato para receber orientações específicas.",
  },
  {
    q: "Como saber qual atendimento procurar?",
    a: "Se você busca compreender e lidar melhor com emoções, pensamentos e situações do dia a dia, a psicoterapia pode ser o caminho. Se há dúvidas sobre memória, atenção, aprendizagem ou outras funções cognitivas — muitas vezes com indicação de outro profissional —, a avaliação neuropsicológica pode ser indicada. Em caso de dúvida, entre em contato: conversamos e eu oriento qual é o melhor caminho.",
  },
];
