/**
 * Informações editáveis do site.
 *
 * Tudo que é texto institucional, contato ou dado profissional fica aqui.
 * Campos vazios ("" ou []) ficam ocultos no site público e passam a
 * aparecer automaticamente assim que forem preenchidos — sem mexer nas páginas.
 */

export const site = {
  name: "Pablo Ribeiro",
  role: "Psicólogo",
  crp: "CRP 04/53880",
  city: "Juiz de Fora",
  state: "MG",
  audience: "Todas as idades",
  areas: ["Terapia Cognitivo-Comportamental (TCC)", "Avaliação Neuropsicológica"],

  contact: {
    /** Somente números, com DDI + DDD. Ex.: "5532999999999". */
    whatsapp: "5532988411284",
    /** Como o número aparece escrito no site. Ex.: "(32) 99999-9999". */
    whatsappDisplay: "(32) 98841-1284",
    email: "",
    instagramHandle: "psico_pabloribeiro",
  },

  office: {
    /** Ex.: "Rua Exemplo, 123 — sala 45" */
    address: "",
    neighborhood: "",
    cep: "",
    /** Informações úteis: estacionamento, acessibilidade, referência. */
    details: "",
    /** Dias e horários de atendimento. */
    hours: "",
    /** URL de incorporação do Google Maps (Compartilhar → Incorporar mapa → src). */
    mapEmbedUrl: "",
  },

  sessions: {
    /** Ex.: "50 minutos" */
    duration: "",
    /** Plataforma usada nas sessões online. Ex.: "Google Meet" */
    onlinePlatform: "",
  },

  about: {
    /** Parágrafos da biografia profissional. */
    bio: [] as string[],
    /** Ex.: "Graduação em Psicologia — Instituição (ano)" */
    education: [] as string[],
    specializations: [] as string[],
    experience: [] as string[],
  },

  neuro: {
    /** Faixas etárias atendidas na avaliação. */
    audience: "",
    /** Duração média / número de sessões do processo. */
    duration: "",
    /** Observações sobre instrumentos e protocolos utilizados. */
    instruments: "",
  },
} as const;

/** Endereço público do site, usado em canonical, Open Graph e sitemap. */
export const SITE_URL = "https://pabloribeiro.lovable.app";

export const instagramUrl = `https://www.instagram.com/${site.contact.instagramHandle}/`;
export const instagramDirectUrl = `https://ig.me/m/${site.contact.instagramHandle}`;

export function hasText(value: string | readonly string[] | undefined | null): boolean {
  if (!value) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return value.some((v) => v.trim().length > 0);
}
