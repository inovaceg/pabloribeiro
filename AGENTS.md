<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All editable professional info (contacts, address, bio, session details) lives in `src/config/site.ts`; empty fields are hidden from the public site (no placeholder notices). Why: the owner updates content without touching pages, and nothing unconfirmed is ever shown or invented.
- Scheduling links go through `getBookingChannel` in `src/lib/contact.ts` (WhatsApp when configured, Instagram Direct fallback) with page-specific `BOOKING_MESSAGES`. Why: one place controls every booking button.
- The contact form stores no data: it builds the message client-side and hands it to WhatsApp/Instagram. Why: institutional site, no patient data storage (LGPD / ethics).
- Per-route SEO uses `pageHead()` from `src/lib/seo.ts`. Why: consistent title/description/OG/canonical on every page.
