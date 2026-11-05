import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { site, instagramDirectUrl } from "@/config/site";
import { buildContactMessage, buildWhatsAppUrl, contactSchema, type ContactInput } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { buttonClass } from "./booking";
import { WhatsAppIcon } from "./icons";

const fieldClass =
  "w-full rounded-md border border-input bg-paper px-4 py-3.5 text-[0.95rem] text-navy placeholder:text-muted-foreground/70 transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 aria-[invalid=true]:border-destructive";

function FieldError({ message, id }: { message?: string | undefined; id: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  );
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  register,
  error,
}: {
  legend: string;
  name: "subject" | "modality";
  options: { value: T; label: string }[];
  register: UseFormRegister<ContactInput>;
  error?: string | undefined;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-medium text-navy">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" value={o.value} {...register(name)} className="peer sr-only" />
            <span className="inline-flex rounded-full border border-input bg-paper px-4 py-2 text-sm text-navy/80 transition-all peer-checked:border-navy peer-checked:bg-navy peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-sage/50">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState<null | "whatsapp" | "instagram">(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (data: ContactInput) => {
    const text = buildContactMessage(data);
    const wa = buildWhatsAppUrl(site.contact.whatsapp, text);
    if (wa) {
      const win = window.open(wa, "_blank", "noopener,noreferrer");
      if (!win) window.location.href = wa;
      setSent("whatsapp");
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* clipboard may be unavailable; the user can still write directly */
      }
      window.open(instagramDirectUrl, "_blank", "noopener,noreferrer");
      setSent("instagram");
    }
    toast.success(
      wa ? "WhatsApp aberto com a sua mensagem pronta." : "Mensagem copiada. Cole no Direct do Instagram.",
    );
    reset();
  };

  if (sent) {
    return (
      <div role="status" className="rounded-xl border border-border bg-paper p-8 sm:p-10">
        <CheckCircle2 className="size-8 text-sage" aria-hidden />
        <h3 className="mt-5 text-2xl text-navy">
          {sent === "whatsapp" ? "Sua mensagem está pronta no WhatsApp." : "Sua mensagem foi copiada."}
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {sent === "whatsapp"
            ? "O WhatsApp foi aberto com a mensagem organizada. Ela só será enviada quando você tocar em enviar por lá."
            : "O Direct do Instagram foi aberto em uma nova aba. Cole a mensagem e envie por lá."}
        </p>
        <button type="button" onClick={() => setSent(null)} className={buttonClass("outline", "mt-7")}>
          Preencher novamente
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
            Nome
          </label>
          <input
            id="name"
            autoComplete="name"
            maxLength={80}
            className={fieldClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-navy">
            Telefone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(32) 00000-0000"
            maxLength={20}
            className={fieldClass}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
            E-mail <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            className={fieldClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
      </div>

      <ChoiceGroup
        legend="Assunto"
        name="subject"
        register={register}
        error={errors.subject?.message}
        options={[
          { value: "psicoterapia", label: "Psicoterapia" },
          { value: "avaliacao", label: "Avaliação Neuropsicológica" },
          { value: "outro", label: "Outro" },
        ]}
      />

      <ChoiceGroup
        legend="Modalidade de preferência"
        name="modality"
        register={register}
        error={errors.modality?.message}
        options={[
          { value: "presencial", label: "Presencial" },
          { value: "online", label: "Online" },
          { value: "indefinido", label: "Ainda não sei" },
        ]}
      />

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-navy">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={5}
          maxLength={600}
          className={cn(fieldClass, "resize-y")}
          placeholder="Conte brevemente como posso ajudar ou qual dúvida você tem."
          aria-invalid={!!errors.message}
          aria-describedby="message-hint"
          {...register("message")}
        />
        <div className="mt-1.5 flex justify-between gap-4 text-xs text-muted-foreground" id="message-hint">
          <span>Não inclua informações clínicas.</span>
          <span>{messageLength}/600</span>
        </div>
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-navy"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <span>
            Li e concordo com a{" "}
            <Link to="/politica-de-privacidade" className="text-navy underline underline-offset-4">
              Política de Privacidade
            </Link>
            . Meus dados serão usados apenas para retorno deste contato.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>

      <button type="submit" disabled={isSubmitting} className={buttonClass("whatsapp", "w-full py-4 sm:w-auto sm:px-8")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        <WhatsAppIcon className="size-4" />
        Preparar mensagem no WhatsApp
      </button>
      <p className="text-xs text-muted-foreground">
        A mensagem é aberta no{" "}
        {buildWhatsAppUrl(site.contact.whatsapp) ? "WhatsApp" : "Direct do Instagram"} para você
        revisar e enviar. Nenhum dado fica armazenado neste site.
      </p>
    </form>
  );
}
