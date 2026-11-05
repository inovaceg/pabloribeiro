import { describe, expect, it } from "vitest";

import { buildContactMessage, buildWhatsAppUrl, contactSchema, getBookingChannel } from "./contact";

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
  it("is not generated while no number is configured (never invent a number)", () => {
    expect(buildWhatsAppUrl("")).toBeNull();
    expect(buildWhatsAppUrl("3299990000")).toBeNull();
  });

  it("uses digits only and encodes the message", () => {
    expect(buildWhatsAppUrl("+55 (32) 99999-0000", "Olá Pablo")).toBe(
      "https://wa.me/5532999990000?text=Ol%C3%A1%20Pablo",
    );
  });

  it("falls back to Instagram Direct when WhatsApp is not configured", () => {
    expect(getBookingChannel("", "https://ig.me/m/x").kind).toBe("instagram");
    expect(getBookingChannel("5532999990000", "https://ig.me/m/x").kind).toBe("whatsapp");
  });
});

describe("Contact form validation", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires privacy-policy consent", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("requires a phone or an e-mail for the reply", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "", email: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "", email: "maria@exemplo.com" }).success).toBe(true);
  });

  it("limits the message to 600 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(601) }).success).toBe(false);
  });

  it("builds a readable message for the professional", () => {
    const text = buildContactMessage(valid);
    expect(text).toContain("Meu nome é Maria Souza");
    expect(text).toContain("Assunto: Psicoterapia (TCC)");
    expect(text).toContain("Modalidade: Online");
  });
});
