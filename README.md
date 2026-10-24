# BRUNA — Mentoria de Carreira e Executiva
## Landing Page Premium (Conceito 02)

Landing page de alta conversão desenvolvida com arquitetura front-end moderna, ultra-leve, sem dependências externas desnecessárias e com prioridade absoluta em **Mobile-First**.

---

## 🎨 Identidade Visual e Design System

- **Paleta de Cores**:
  - Fundo principal: `#090911` (Night)
  - Fundo escuro alternativo: `#0B0B15` (Ink)
  - Painéis e cards escuros: `#14131F` / `#11101C`
  - Fundo claro das seções editoriais: `#F5F3F2` / `#F4F1F8`
  - Violeta principal: `#9879FF`
  - Lavanda: `#C5AFFF`
  - Roxo auxiliar: `#846AFF`
  - Lavanda clara: `#B5A0FF`
  - Gradiente principal: `linear-gradient(110deg, #C5AFFF 0%, #9879FF 100%)`
  - Gradiente tipográfico: `linear-gradient(110deg, #EEE7FF 5%, #AC92FF 48%, #E0B9DB 99%)`
- **Tipografia**: Família *Inter* com fallbacks otimizados do sistema e *Georgia Italic* para destaques editoriais sofisticados.
- **Microinterações**: Efeito shimmer sweep nos botões principais, auroras animadas com órbitas brilhantes, rotação suave dos ícones do FAQ, e feedback dinâmico de cópia no formulário.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v16 ou superior).

### Inicialização Rápida
Abra o terminal na pasta do projeto e execute:

```bash
npm start
# ou
node server.js
```

O servidor local iniciará instantaneamente (por padrão em `http://localhost:3000` ou `http://localhost:3001` caso a 3000 esteja ocupada).

---

## 📁 Estrutura de Arquivos

```text
├── css/
│   ├── variables.css      # Design tokens (cores, gradientes, sombras, raios)
│   ├── base.css           # Reset, tipografia, utilitários globais e acessibilidade
│   ├── components.css     # Botões (shimmer), cards, moldura de vídeo, FAQ, modais
│   └── sections.css       # Layouts das seções e media queries responsivas
├── js/
│   ├── config.js          # Arquivo central para configuração de textos, contatos e vídeos
│   └── main.js            # Lógica interativa, modais, menu mobile, FAQ e formulário
├── assets/
│   ├── images/            # Foto real da Bruna e capas dos vídeos
│   └── videos/            # Quatro MP4 demonstrativos locais
├── scripts/build.js       # Gera uma cópia estática pronta para publicação em dist/
├── ASSET-SOURCES.md       # Origem, licença e mapeamento dos assets temporários
├── index.html             # Documento HTML5 semântico, acessível e otimizado para SEO
├── server.js              # Servidor HTTP estático nativo em Node.js (sem dependências)
├── package.json           # Metadados e scripts do projeto
└── README.md              # Documentação completa
```

---

## ⚙️ Personalização Simplificada (`js/config.js`)

Todos os dados variáveis podem ser configurados diretamente no arquivo [`js/config.js`](file:///g:/Users/kauek/Desktop/claude/!LEADS/Bruna%20-%20mentoria%20coach/js/config.js):

1. **Número do WhatsApp**: Atualize `contact.whatsappNumber` com DDD e número internacional e defina `form.enableDirectWhatsApp` como `true` somente após validar o canal oficial.
2. **Vídeo Real da Bruna**: Quando tiver o link do YouTube, Vimeo ou arquivo MP4 local, basta definir `videos.apresentacao.videoUrl`. O player responsivo será injetado automaticamente no modal.
3. **Fotografia da Mentora**: Em `mentor.photoUrl`, insira o caminho da foto oficial.
4. **Avaliações do Google**: Atualize o link e a contagem confirmada em `reputation`.
5. **Integração de Leads (CRM/Webhook)**: Em `form.webhookUrl`, adicione a URL de integração para envio automático dos dados (Make, n8n, RD Station, ActiveCampaign).

Os vídeos temporários e suas capas estão centralizados em `js/config.js`. A origem e a licença de cada item estão documentadas em `ASSET-SOURCES.md`.

## ✅ Validação e build

```bash
npm run check
npm run build
```

O build copia apenas os arquivos necessários para `dist/` e mantém a versão de desenvolvimento intacta.

Para repetir a validação visual automatizada, instale o Chromium do Playwright uma vez, inicie o servidor e rode a suíte:

```bash
npx playwright install chromium
npm start
# em outro terminal, apontando para a porta exibida pelo servidor:
set QA_BASE_URL=http://127.0.0.1:3000 && npm run qa
```

---

## 📱 Responsividade e Dispositivos Testados

O projeto foi construído rigorosamente no conceito Mobile-First com testes nos seguintes breakpoints:
- **320px – 380px**: Telas compactas (sem overflow horizontal, tipografia fluida com `clamp()`).
- **390px – 430px**: Smartphones modernos (Hero de alto impacto, CTA em largura total, card de vídeo proporcional, barra fixa inferior).
- **768px – 950px**: Tablets verticais e horizontais.
- **1024px – 1440px+**: Desktop widescreen (Hero balanceada em duas colunas, grids refinados).

---

## 🛡️ Acessibilidade & Boas Práticas

- Navegação por teclado completa com estados `:focus-visible` destacados em lavanda.
- Modais com fechamento por tecla `Escape`, foco gerenciado e travamento de scroll no body (`body.modal-open`).
- Suporte a `prefers-reduced-motion` desativando animações para usuários com sensibilidade vestibular.
- Semântica ARIA adequada (`aria-expanded`, `aria-controls`, `aria-labelledby`, `role="dialog"`).
- Ocultação inteligente do CTA flutuante mobile via `IntersectionObserver` quando o usuário atinge o formulário de conversão, garantindo que nenhum campo seja encoberto.

---

## 🌐 Deploy em Produção

O projeto é 100% estático (HTML, CSS e JS nativos) e pode ser hospedado gratuitamente e com performance máxima em qualquer provedor:
- **Vercel**: Basta conectar o repositório ou rodar `npx vercel`.
- **Netlify**: Arraste a pasta do projeto no painel do Netlify ou conecte via Git.
- **GitHub Pages**: Habilite GitHub Pages nas configurações do repositório apontando para a branch `main`.

---
*Conceito estratégico desenvolvido com excelência visual e código limpo.*
