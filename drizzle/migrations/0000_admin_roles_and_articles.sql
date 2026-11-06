-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Emails that automatically receive the admin role when their account is created
CREATE TABLE public.admin_emails (
  email text PRIMARY KEY CHECK (email = lower(email))
);
GRANT ALL ON public.admin_emails TO service_role;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.grant_admin_from_allowlist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_from_allowlist();

-- Articles
CREATE TYPE public.article_status AS ENUM ('draft', 'published');

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 120),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 300),
  category text NOT NULL DEFAULT 'Saúde emocional' CHECK (char_length(category) BETWEEN 1 AND 60),
  body text NOT NULL DEFAULT '' CHECK (char_length(body) <= 60000),
  cover_url text CHECK (cover_url IS NULL OR cover_url ~ '^https://'),
  cover_alt text NOT NULL DEFAULT '' CHECK (char_length(cover_alt) <= 200),
  status public.article_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_published_idx ON public.articles (status, published_at DESC);

GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are public" ON public.articles
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all articles" ON public.articles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete articles" ON public.articles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Keep timestamps consistent: updated_at on every change, published_at on first publish
CREATE OR REPLACE FUNCTION public.articles_set_timestamps()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_timestamps
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.articles_set_timestamps();

-- Storage policies for article cover images (bucket created separately)
CREATE POLICY "Admins can upload article covers" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'article-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update article covers" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'article-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete article covers" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'article-covers' AND public.has_role(auth.uid(), 'admin'));

-- Existing articles
INSERT INTO public.articles (slug, title, description, category, body, status, published_at) VALUES
('quando-procurar-um-psicologo', 'Quando procurar um psicólogo?', 'Não é preciso esperar uma crise para buscar ajuda. Veja sinais e situações em que o acompanhamento psicológico pode fazer diferença.', 'Psicoterapia', 'Muitas pessoas ainda associam a psicoterapia apenas a momentos de crise. Mas o acompanhamento psicológico também é um espaço para se conhecer melhor, atravessar mudanças com mais clareza e desenvolver formas mais saudáveis de lidar com o que se sente.

## Alguns sinais que merecem atenção

- Tristeza, irritação ou preocupação que se prolongam e passam a afetar a rotina.
- Dificuldade para dormir, se concentrar ou realizar atividades que antes eram simples.
- Sensação de estar sobrecarregado, sem conseguir dar conta das demandas.
- Conflitos frequentes nos relacionamentos, em casa ou no trabalho.
- Perdas, separações, mudanças de cidade, de emprego ou outros momentos de transição.
- Vontade de compreender melhor a si mesmo, mesmo sem um problema específico.

## Não existe um “problema grande o suficiente”

É comum adiar a procura por ajuda por achar que outras pessoas passam por situações mais difíceis. O sofrimento não precisa ser comparado: se algo tem incomodado você, isso já é motivo suficiente para conversar com um profissional.

## E para crianças e adolescentes?

Mudanças de comportamento, dificuldades na escola, isolamento ou alterações no sono e na alimentação podem indicar que a criança ou o adolescente precisa de apoio. Nesses casos, a família costuma participar do processo, e o profissional orienta sobre o melhor caminho.

## Como dar o primeiro passo

O primeiro contato serve justamente para tirar dúvidas e entender se o acompanhamento faz sentido para você neste momento. Não é preciso chegar com tudo organizado — a conversa acontece no seu ritmo.

Em situações de emergência ou risco à vida, procure imediatamente o CVV (188, ligação gratuita, 24 horas), o SAMU (192) ou o pronto-atendimento mais próximo.', 'published', '2026-11-05T12:00:00Z'),
('o-que-e-terapia-cognitivo-comportamental', 'O que é Terapia Cognitivo-Comportamental (TCC)?', 'Entenda como a TCC trabalha a relação entre pensamentos, emoções e comportamentos, e como costuma ser o processo terapêutico.', 'TCC', 'A Terapia Cognitivo-Comportamental, conhecida como TCC, é uma das abordagens da psicologia mais estudadas. Ela parte da ideia de que a forma como interpretamos as situações influencia o que sentimos e a maneira como agimos.

## Pensamentos, emoções e comportamentos

Diante de um mesmo acontecimento, duas pessoas podem reagir de formas muito diferentes. Isso acontece porque cada uma interpreta a situação a partir das próprias experiências e crenças. Na TCC, terapeuta e paciente investigam juntos esses padrões, especialmente os que geram sofrimento ou dificultam a vida.

## Como costuma ser o processo

- Compreensão da demanda: o que trouxe a pessoa até a terapia e o que ela deseja mudar.
- Definição de objetivos, construídos em conjunto e revistos ao longo do caminho.
- Identificação de pensamentos, emoções e comportamentos que se repetem.
- Desenvolvimento de estratégias práticas para lidar com as situações do dia a dia.
- Atividades entre as sessões, quando fazem sentido, para levar o que foi trabalhado para a rotina.

## Uma abordagem colaborativa

Na TCC, o paciente participa ativamente. O terapeuta não “dá respostas prontas”: ajuda a pessoa a observar a própria experiência com mais clareza e a construir alternativas que façam sentido para a sua vida.

## Para quem é indicada?

A TCC pode ser adaptada para pessoas de diferentes idades — crianças, adolescentes, adultos e idosos — e para demandas variadas, como ansiedade, tristeza persistente, dificuldades nos relacionamentos ou momentos de transição. A indicação é sempre avaliada individualmente, a partir da primeira conversa.', 'published', '2026-11-05T12:00:00Z'),
('para-que-serve-a-avaliacao-neuropsicologica', 'Para que serve a Avaliação Neuropsicológica?', 'Saiba o que é a avaliação neuropsicológica, quando ela costuma ser indicada e como funcionam as etapas do processo.', 'Avaliação Neuropsicológica', 'A avaliação neuropsicológica é um processo que investiga funções como atenção, memória, linguagem e funções executivas, e a relação delas com as emoções e o comportamento. O objetivo é compreender como a pessoa funciona — suas potencialidades e suas dificuldades.

## Quando ela costuma ser indicada

- Dificuldades de atenção, concentração ou organização no dia a dia.
- Queixas de memória, em qualquer fase da vida.
- Dificuldades de aprendizagem ou de desempenho escolar.
- Investigação de hipóteses como TDAH ou TEA, em conjunto com outros profissionais.
- Mudanças cognitivas percebidas pela própria pessoa ou pela família.
- Necessidade de orientar intervenções, adaptações escolares ou acompanhamento terapêutico.

Muitas vezes, a avaliação é solicitada por médicos, escolas ou outros profissionais de saúde. Mas a própria pessoa ou a família também pode buscá-la quando percebe alguma dificuldade.

## Como funciona o processo

- Entrevista inicial, para compreender a demanda e a história da pessoa avaliada.
- Sessões de avaliação, com tarefas e instrumentos escolhidos para cada caso.
- Análise e integração das informações obtidas.
- Devolutiva, em que os resultados são explicados com clareza e as orientações são discutidas.

## O que a avaliação não é

A avaliação neuropsicológica não é um teste rápido nem um “rótulo”. É um processo cuidadoso, que considera a pessoa como um todo e contribui para decisões mais bem fundamentadas sobre tratamento, estudo, trabalho e rotina.', 'published', '2026-11-05T12:00:00Z'),
('ansiedade-no-dia-a-dia', 'Ansiedade no dia a dia: quando ela deixa de ajudar?', 'A ansiedade faz parte da vida, mas pode se tornar excessiva. Entenda a diferença e conheça cuidados que ajudam no cotidiano.', 'Saúde emocional', 'Sentir ansiedade antes de uma prova, de uma entrevista ou de uma decisão importante é natural. Ela funciona como um sinal de alerta que nos prepara para lidar com desafios. O problema começa quando essa resposta aparece com muita intensidade, com frequência ou sem um motivo claro.

## Sinais de que a ansiedade pode estar excessiva

- Preocupação constante e difícil de controlar.
- Tensão muscular, inquietação, coração acelerado ou falta de ar.
- Dificuldade para dormir ou para relaxar.
- Evitar situações, lugares ou pessoas por medo do que pode acontecer.
- Prejuízo nos estudos, no trabalho ou nos relacionamentos.

## Cuidados que ajudam no cotidiano

- Manter uma rotina de sono regular, na medida do possível.
- Praticar atividade física de forma consistente.
- Reduzir o excesso de cafeína e de estímulos, como telas antes de dormir.
- Reservar momentos de pausa ao longo do dia.
- Conversar sobre o que está sentindo com pessoas de confiança.

Esses cuidados ajudam, mas nem sempre são suficientes. Se a ansiedade tem atrapalhado a sua vida, buscar acompanhamento psicológico é um passo importante. Na psicoterapia, é possível compreender o que alimenta esse ciclo e desenvolver formas mais saudáveis de lidar com ele.

Este texto é informativo e não substitui avaliação profissional. Em situações de crise, procure o CVV (188) ou o SAMU (192).', 'published', '2026-11-05T12:00:00Z');