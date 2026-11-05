import { createFileRoute } from "@tanstack/react-router";

import { site, instagramUrl, hasText } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { PageHero } from "@/components/site/primitives";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    pageHead({
      title: "Política de Privacidade | Pablo Ribeiro, Psicólogo",
      description:
        "Saiba como os dados enviados pelo site de Pablo Ribeiro, psicólogo em Juiz de Fora, são tratados, em conformidade com a LGPD.",
      path: "/politica-de-privacidade",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Documento"
        title="Política de Privacidade"
        intro="Transparência sobre o uso das informações compartilhadas por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      />
      <section className="py-16 sm:py-24">
        <article className="container-site max-w-3xl space-y-10 leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-navy">
          <div>
            <h2>1. Responsável</h2>
            <p>
              Este site pertence a {site.name}, {site.role.toLowerCase()} ({site.crp}), com atuação
              em {site.city} – {site.state}. Para assuntos relacionados aos seus dados, utilize os
              canais de contato informados neste site
              {hasText(site.contact.email) ? ` ou o e-mail ${site.contact.email}` : ""}.
            </p>
          </div>
          <div>
            <h2>2. Quais dados são coletados</h2>
            <p>
              Ao utilizar o formulário de contato, você informa nome, telefone e/ou e-mail, assunto,
              modalidade de preferência e uma mensagem. Este site não armazena essas informações em
              banco de dados: a mensagem é montada no seu próprio navegador e aberta no WhatsApp ou
              no Instagram para que você mesmo confirme o envio.
            </p>
          </div>
          <div>
            <h2>3. Finalidade</h2>
            <p>
              Os dados enviados são utilizados exclusivamente para responder ao seu contato, prestar
              informações sobre os atendimentos e realizar agendamentos. Não são compartilhados com
              terceiros para fins comerciais.
            </p>
          </div>
          <div>
            <h2>4. Informações sensíveis</h2>
            <p>
              Recomendamos que você não compartilhe detalhes clínicos ou informações de saúde pelo
              formulário ou por mensagens. Esses assuntos devem ser tratados durante o atendimento,
              sob sigilo profissional, conforme o Código de Ética Profissional do Psicólogo.
            </p>
          </div>
          <div>
            <h2>5. Serviços de terceiros</h2>
            <p>
              Ao clicar em links para WhatsApp, Instagram{hasText(site.office.mapEmbedUrl) ? " ou Google Maps" : ""}, você
              passa a interagir com plataformas de terceiros, que possuem suas próprias políticas de
              privacidade. Recomendamos a leitura dessas políticas.
            </p>
          </div>
          <div>
            <h2>6. Seus direitos</h2>
            <p>
              Você pode solicitar, a qualquer momento, a confirmação da existência de tratamento, o
              acesso, a correção ou a exclusão dos seus dados pessoais, entrando em contato pelos
              canais oficiais, como o{" "}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-4">
                Instagram @{site.contact.instagramHandle}
              </a>
              .
            </p>
          </div>
          <div>
            <h2>7. Atualizações</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Recomendamos consultá-la sempre que
              utilizar o site.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
