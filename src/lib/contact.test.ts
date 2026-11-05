import { describe, expect, it } from "vitest";

import { site, instagramDirectUrl } from "@/config/site";
import {
  BOOKING_MESSAGES,
  buildContactMessage,
  buildWhatsAppUrl,
  contactSchema,
  getBookingChannel,
} from "./contact";

const valid = {
  name: "Maria Souza",
  phone: "(32) 99999-0000",
  email: "",
  subject: "psicoterapia" as const,
  modality: "online" as const,
  message: "Gostaria de saber sobre horários disponíveis.",
  consent: true,
};

describe("WhatsApp link", () => {
  it("uses the official number 5532988411284 for every booking button", () => {
    const channel = getBookingChannel(site.contact.whatsapp, instagramDirectUrl);
    expect(channel.kind).toBe("whatsapp");
    expect(channel.href.startsWith("https://wa.me/5532988411284?text=")).toBe(true);
  });

  it("is not generated for an empty or incomplete number", () => {
    expect(buildWhatsAppUrl("")).toBeNull();
    expect(buildWhatsAppUrl("3299990000")).toBeNull();
  });

  it("uses digits only and encodes the message", () => {
    expect(buildWhatsAppUrl("+55 (32) 98841-1284", "Olá Pablo")).toBe(
      "https://wa.me/5532988411284?text=Ol%C3%A1%20Pablo",
    );
  });

  it("pre-fills the page-specific messages", () => {
    expect(BOOKING_MESSAGES.psicoterapia).toBe(
      "Olá, Pablo! Gostaria de obter informações sobre atendimento psicológico e psicoterapia.",
    );
    expect(BOOKING_MESSAGES.avaliacao).toBe(
      "Olá, Pablo! Gostaria de saber mais sobre a Avaliação Neuropsicológica.",
    );
    expect(BOOKING_MESSAGES.agendamento).toBe(
      "Olá, Pablo! Gostaria de verificar a disponibilidade de horários para atendimento.",
    );
  });

  it("falls back to Instagram Direct only when no number is configured", () => {
    expect(getBookingChannel("", "https://ig.me/m/x").kind).toBe("instagram");
  });
});

describe("Contact form validation", () => {
  it("accepts a complete submission with e-mail left blank", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires privacy-policy consent", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("requires a phone number", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
  });

  it("limits the message to 600 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(601) }).success).toBe(false);
  });

  it("builds an organised message for the professional", () => {
    const text = buildContactMessage(valid);
    expect(text).toContain("Meu nome é Maria Souza");
    expect(text).toContain("Assunto: Psicoterapia (TCC)");
    expect(text).toContain("Modalidade: Online");
    expect(text).toContain("Telefone: (32) 99999-0000");
  });
});
