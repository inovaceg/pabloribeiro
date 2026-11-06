import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { buttonClass } from "@/components/site/booking";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha | Área administrativa · Pablo Ribeiro" },
      { name: "description", content: "Defina uma nova senha de acesso." },
      { property: "og:title", content: "Nova senha | Área administrativa · Pablo Ribeiro" },
      { property: "og:description", content: "Defina uma nova senha de acesso." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

const fieldClass =
  "w-full rounded-md border border-input bg-paper px-4 py-3 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session && isRecovery) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError("Não foi possível alterar a senha. Escolha uma senha mais forte ou peça um novo link.");
    toast.success("Senha alterada.");
    navigate({ to: "/admin", replace: true });
  };

  return (
    <section className="flex min-h-[85vh] items-center bg-ivory px-4 pt-28 pb-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-paper p-8 shadow-soft sm:p-10">
        <h1 className="text-3xl text-navy">Criar nova senha</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Abra esta página pelo link enviado ao seu e-mail. Se o link expirou, peça um novo na tela de login.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-navy">Nova senha</label>
              <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} maxLength={200} />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-navy">Repita a nova senha</label>
              <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={fieldClass} maxLength={200} />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass("primary", "w-full py-3.5")}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              Salvar nova senha
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
