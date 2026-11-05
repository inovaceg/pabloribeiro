import { z } from "zod";

export const DEFAULT_BOOKING_MESSAGE =
  "Olá, Pablo! Encontrei seu site e gostaria de informações sobre o atendimento.";

/** Returns a wa.me link, or null when the number is missing or incomplete. */
export function buildWhatsAppUrl(number: string, text?: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 13) return null;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export type BookingChannel =
  | { kind: "whatsapp"; href: string }
  | { kind: "instagram"; href: string };

/** WhatsApp when configured; Instagram Direct as the fallback channel. */
export function getBookingChannel(
  whatsappNumber: string,
  instagramDirectUrl: string,
  text: string = DEFAULT_BOOKING_MESSAGE,
): BookingChannel {
  const wa = buildWhatsAppUrl(whatsappNumber, text);
  return wa ? { kind: "whatsapp", href: wa } : { kind: "instagram", href: instagramDirectUrl };
}

const phoneDigits = (v: string) => v.replace(/\D/g, "");

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome.")
      .max(80, "Use no máximo 80 caracteres."),
    phone: z
      .string()
      .trim()
      .max(20, "Telefone muito longo.")
      .refine((v) => v === "" || (phoneDigits(v).length >= 10 && phoneDigits(v).length <= 13), {
        message: "Informe um telefone válido, com DDD.",
      }),
    email: z
      .string()
      .trim()
      .max(120, "E-mail muito longo.")
      .refine((v) => v === "" || z.string().email().safeParse(v).success, {
        message: "Informe um e-mail válido.",
      }),
    subject: z.enum(["psicoterapia", "avaliacao", "outro"], {
      errorMap: () => ({ message: "Escolha um assunto." }),
    }),
    modality: z.enum(["presencial", "online", "indefinido"], {
      errorMap: () => ({ message: "Escolha uma modalidade." }),
    }),
    message: z
      .string()
      .trim()
      .min(10, "Escreva uma mensagem com pelo menos 10 caracteres.")
      .max(600, "Use no máximo 600 caracteres."),
    consent: z.boolean().refine((v) => v === true, {
      message: "É necessário concordar com a Política de Privacidade.",
    }),
  })
  .refine((d) => d.phone !== "" || d.email !== "", {
    message: "Informe um telefone ou um e-mail para retorno.",
    path: ["phone"],
  });

export type ContactInput = z.infer<typeof contactSchema>;

const SUBJECT_LABEL: Record<ContactInput["subject"], string> = {
  psicoterapia: "Psicoterapia (TCC)",
  avaliacao: "Avaliação Neuropsicológica",
  outro: "Outro assunto",
};

const MODALITY_LABEL: Record<ContactInput["modality"], string> = {
  presencial: "Presencial",
  online: "Online",
  indefinido: "Ainda não sei",
};

export function buildContactMessage(d: ContactInput): string {
  const lines = [
    `Olá, Pablo! Meu nome é ${d.name}.`,
    `Assunto: ${SUBJECT_LABEL[d.subject]}`,
    `Modalidade: ${MODALITY_LABEL[d.modality]}`,
    d.phone ? `Telefone: ${d.phone}` : null,
    d.email ? `E-mail: ${d.email}` : null,
    "",
    d.message,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
