# Relatório de validação — Landing Page Bruna

Data: 23/10/2026

## Assets

- Diretório de fotos acessado com sucesso: `G:\Users\kauek\Desktop\claude\!LEADS\Bruna - mentoria coach\FOTOS`.
- Fotografia encontrada: `Apresentadora em Vestido Vermelho Neon.png`, 1122 × 1402 px, PNG com transparência.
- A cópia `assets/images/bruna-hero.png` foi confirmada como idêntica ao arquivo original por hash SHA-256.
- Quatro vídeos Mixkit e suas capas foram baixados para o projeto. Origem e licença estão documentadas em `ASSET-SOURCES.md`.

## Verificações executadas

- `npm run check`: aprovado.
- `npm run build`: aprovado; saída gerada em `dist/`.
- Navegador Chromium/Playwright: 11 testes aprovados.
- Breakpoints verificados: 320, 360, 375, 390, 414, 430, 768, 1024 e 1440 px.
- Sem overflow horizontal nos nove tamanhos.
- Fotografia da Hero carregada com dimensões e proporção corretas.
- CTA principal, CTA fixo mobile e fluxo de qualificação verificados.
- Quatro players abriram no modal, carregaram mídia real, reproduziram, pausaram e fecharam corretamente.
- Controles nativos de reprodução e som estão habilitados.
- WhatsApp fictício permanece desabilitado até a configuração de um número oficial.

## Capturas

- `qa/screenshots/bruna-mobile-390-primeira-dobra.png`
- `qa/screenshots/bruna-mobile-390-completa.png`
- `qa/screenshots/bruna-desktop-1440.png`

## Estado demonstrativo

Todos os vídeos estão identificados como ilustrativos e não atribuem às pessoas filmadas qualquer relação com a Bruna. A substituição futura depende apenas de atualizar caminhos e metadados em `js/config.js`.
