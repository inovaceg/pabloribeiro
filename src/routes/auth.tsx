import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { buttonClass } from "@/components/site/booking";

const searchSchema = z.object({ redirect: z.string().optional() });

/** Only allow same-site relative paths as post-login destinations. */
function safeRedirect(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar | Área administrativa · Pablo Ribeiro" },
      { name: "description", content: "Acesso restrito à área administrativa do site." },
      { property: "og:title", content: "Entrar | Área administrativa · Pablo Ribeiro" },
      { property: "og:description", content: "Acesso restrito à área administrativa do site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const fieldClass =
  "w-full rounded-md border border-input bg-paper px-4 py-3 text-navy placeholder:text-muted-foreground/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30";

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: safeRedirect(redirect), replace: true });
    });
  }, [navigate, redirect]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = z.object({ email: z.string().trim().email(), password: z.string().min(1) }).safeParse({ email, password });
    if (!parsed.success) {
      setError("Informe um e-mail válido e a senha.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (err) {
      setError(err.message.includes("Email not confirmed") ? "Confirme seu e-mail antes de entrar." : "E-mail ou senha incorretos.");
      return;
    }
    toast.success("Bem-vindo!");
    navigate({ to: safeRedirect(redirect), replace: true });
  };

  const onForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!z.string().trim().email().safeParse(email).success) {
      setError("Informe um e-mail válido.");
      return;
    }
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setSent(true);
  };

  return (
    <section className="flex min-h-[85vh] items-center bg-ivory px-4 pt-28 pb-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-paper p-8 shadow-soft sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-xl bg-navy text-sand">
          <LockKeyhole className="size-5" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl text-navy">{mode === "login" ? "Área administrativa" : "Recuperar senha"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Acesso restrito para gerenciar os artigos do site."
            : "Enviaremos um link para você criar uma nova senha."}
        </p>

        {mode === "forgot" && sent ? (
          <p role="status" className="mt-8 rounded-lg bg-sage-soft/70 p-4 text-sm text-navy">
            Se este e-mail tiver acesso, você receberá um link para criar uma nova senha. Confira também a caixa de spam.
          </p>
        ) : (
          <form onSubmit={mode === "login" ? onLogin : onForgot} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">E-mail</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} maxLength={120} />
            </div>
            {mode === "login" && (
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-navy">Senha</label>
                <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} maxLength={200} />
              </div>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass("primary", "w-full py-3.5")}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Enviar link"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "forgot" : "login");
            setError(null);
            setSent(false);
          }}
          className="mt-6 text-sm text-navy underline underline-offset-4"
        >
          {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
        </button>
      </div>
    </section>
  );
}
