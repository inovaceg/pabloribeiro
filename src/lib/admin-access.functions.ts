import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  origin: z
    .string()
    .url()
    .max(200)
    .refine((o) => /^https:\/\//.test(o) || /^http:\/\/localhost(:\d+)?$/.test(o), "invalid origin"),
});

/**
 * "Primeiro acesso / esqueci a senha" for the admin area.
 * Only e-mails on the private admin allowlist receive anything:
 *  - no account yet  → invitation e-mail (creates the account; the allowlist trigger grants the admin role)
 *  - existing account → password reset e-mail
 * Always returns the same generic result so the form never reveals who is an admin.
 */
export const requestAdminAccessLink = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; origin: string }) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const redirectTo = `${new URL(data.origin).origin}/reset-password`;

    const { data: allowed, error: allowErr } = await supabaseAdmin
      .from("admin_emails")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();
    if (allowErr) console.error("admin allowlist lookup failed", allowErr.message);
    if (!allowed) return { ok: true as const };

    const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, { redirectTo });
    if (inviteErr) {
      // Most likely the account already exists: send a password reset instead.
      const { error: resetErr } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, { redirectTo });
      if (resetErr) console.error("admin access link failed", inviteErr.message, resetErr.message);
    }
    return { ok: true as const };
  });
