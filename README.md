# Portfólio · Mateus Higashie

Portfólio de Product Design feito com Next.js (App Router), TypeScript e Tailwind CSS.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

Requer Node 20.9 ou mais novo.

## Onde editar o conteúdo

Todo o texto do site sai de quatro arquivos. Não é preciso mexer nos componentes.

| Arquivo | O que tem |
|---|---|
| `src/content/profile.ts` | Nome, título (com o campo opcional `LEVEL` para senioridade), frase do topo, palavras com física, contatos, sobre, competências, ferramentas, experiência, formação e depoimentos (desligados) |
| `src/content/projects.ts` | Estudo de caso Pormade e os projetos do carrossel "Mais projetos" (imagem, categoria e descrição) |
| `src/content/premium-league.ts` | Estudo de caso Premium League |
| `src/content/mini-cases.ts` | Cases resumidos dos projetos de produto (Akamai, Angel Investor e os do carrossel) |

Procure por `TODO` nesses arquivos. Textos que começam com "TODO" aparecem em `npm run dev` como pendência e somem em produção. `draft: true` mostra um aviso de rascunho só em desenvolvimento; mude para `false` quando revisar. Trechos marcados `TODO-revisar` foram reconstruídos e precisam da sua validação antes de publicar.

Os 4 projetos em destaque são definidos em `FEATURED`, no topo de `src/components/project-grid.tsx`. Imagens ficam em `public/projetos/<projeto>/`. As cores e tamanhos de texto ficam em `src/app/globals.css` (tokens no topo do arquivo).

## Capas e protótipos

- Capas dos cards: as capas publicadas no Behance, ajustadas para 16:9 por `scripts/capas-behance.mjs`, ficam em `public/projetos/capas/`.
- As capas de Premium League e Hora do Lar são composições em HTML (`design/capas/pl.html` e `hl.html`) com telas reais, renderizadas em 2x para `public/projetos/<case>/capa.webp`. A imagem de compartilhamento de cada case é `og.jpg`, na mesma pasta.
- Os protótipos animados dos cases ficam em `src/components/prototypes.tsx` e `prototypes-extra.tsx`. São recriações ilustrativas (o site avisa isso), não as telas originais.

## Web Design

As capturas full-page dos sites ficam em `public/projetos/web/` (WebP a 1600px, fatias de até 8000px e thumb do topo), geradas por `node scripts/otimizar-web.mjs <pasta-das-capturas>`. Clientes, segmentos e páginas ficam em `src/content/web-design.ts`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` (que nunca vai para o Git).

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública do site; usada no sitemap, robots e Open Graph |
| `RESEND_API_KEY` | Chave do [Resend](https://resend.com) para o formulário de contato |
| `CONTACT_TO_EMAIL` | Para onde as mensagens do formulário vão |
| `CONTACT_FROM_EMAIL` | Remetente verificado no Resend (padrão: `onboarding@resend.dev`) |

Sem `RESEND_API_KEY`, o formulário valida os dados normalmente e responde que o envio ainda não está ativo, mostrando o e-mail para contato direto. Nada quebra.

## Deploy na Vercel

### Pelo GitHub (recomendado)

1. Envie o código: `git push -u origin main` (o `origin` já aponta para `Higaxi/Portf-lio-Ux`).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. A Vercel detecta Next.js sozinha.
3. Em *Settings → Environment Variables*, cadastre as variáveis acima (Production e Preview).
4. Faça o deploy. Cada pull request ganha uma URL de preview; a branch `main` vai para produção.
5. Domínio próprio: *Settings → Domains*. Depois, atualize `NEXT_PUBLIC_SITE_URL` e faça um novo deploy.

### Pela CLI

```bash
npm i -g vercel
vercel            # primeiro deploy (preview) e vínculo do projeto
vercel env add RESEND_API_KEY
vercel --prod     # produção
```

## Estrutura

```
src/
  app/
    page.tsx                  home (seções em ordem)
    projetos/[slug]/page.tsx  estudos de caso e cases resumidos (gerados estaticamente)
    actions/contact.ts        Server Action do formulário (validação, honeypot, limite por IP)
    sitemap.ts robots.ts opengraph-image.tsx icon.svg not-found.tsx
  components/                 seções e peças de interface
  content/                    todo o conteúdo (veja acima)
  lib/todo.ts                 esconde pendências em produção
docs/screenshots/             capturas em 375, 768 e 1440 px
```
