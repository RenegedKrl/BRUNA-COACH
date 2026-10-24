const fs = require('fs');
const path = require('path');

const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'reviews_real.json'), 'utf8'));

const googleBadgeSvg = `<span class="review-avatar-badge" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="11" height="11">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.3 7.31 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
                      </svg>
                    </span>`;

function getReviewSubtitle(r) {
  if (r.author.includes('Alessandro')) return 'Mentoria de Carreira · Visão e Perspectiva';
  if (r.author.includes('Vanessa')) return 'Desenvolvimento de Negócios e Soluções';
  if (r.author.includes('Camila')) return 'Reflexão e Ampliação de Consciência';
  if (r.author.includes('Daniela')) return 'Desenvolvimento Humano e de Negócios';
  if (r.author.includes('Carolina')) return 'Assertividade e Direcionamento Estratégico';
  if (r.author.includes('Maria')) return 'Mentoria de Carreira e Executiva';
  if (r.author.includes('Fabio')) return 'Liderança Executiva · Transição de Carreira';
  if (r.author.includes('Patricia')) return 'Liderança e Alinhamento de Equipe';
  if (r.author.includes('LARISSA')) return 'RH Estratégico e Conexão de Pessoas · Natura';
  if (r.author.includes('Ivaldo')) return 'Decisões e Transição Profissional';
  if (r.author.includes('Linda')) return 'Desenvolvimento Pessoal e Profissional';
  return 'Avaliação Verificada · Google Maps';
}

function cleanAuthorName(name) {
  if (name === 'LARISSA MARIA SIMOES FERREIRA VIEIRA') return 'Larissa Maria Simões F. Vieira';
  if (name === 'Linda lourenço') return 'Linda Lourenço';
  return name;
}

const slidesHtml = reviews.map((r, i) => {
  const name = cleanAuthorName(r.author);
  const subtitle = getReviewSubtitle(r);
  
  // Format paragraphs nicely with quotes
  const paragraphs = r.text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  let bodyHtml = '';
  if (paragraphs.length === 1) {
    bodyHtml = `<p class="review-card__text">"${paragraphs[0]}"</p>`;
  } else {
    bodyHtml = paragraphs.map((p, pIdx) => {
      let text = p;
      if (pIdx === 0) text = `"${text}`;
      if (pIdx === paragraphs.length - 1) text = `${text}"`;
      return `<p class="review-card__text">${text}</p>`;
    }).join('\n                ');
  }

  return `              <!-- Slide ${i + 1} -->
              <article class="review-card" aria-roledescription="slide" aria-label="${i + 1} de ${reviews.length}: ${name}">
                <div class="review-card__header">
                  <div class="review-card__photo-wrapper">
                    <img
                      src="${r.localPhoto}"
                      alt="Foto de perfil de ${name}"
                      class="review-card__photo"
                      width="48"
                      height="48"
                      decoding="async"
                    >
                    ${googleBadgeSvg}
                  </div>
                  <div class="review-card__meta">
                    <strong>${name}</strong>
                    <span>${subtitle}</span>
                  </div>
                  <div class="review-card__stars" aria-label="5 de 5 estrelas">★★★★★</div>
                </div>
                <div class="review-card__body">
                  ${bodyHtml}
                </div>
                <div class="review-card__footer">
                  <a
                    href="${r.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="verified-tag"
                    title="Ver esta avaliação no Google Maps"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    Avaliação no Google ↗
                  </a>
                  <span class="review-date">${r.date}</span>
                </div>
              </article>`;
}).join('\n\n');

const dotsHtml = reviews.map((_, i) => {
  const activeClass = i === 0 ? ' is-active' : '';
  const selected = i === 0 ? 'true' : 'false';
  return `            <button type="button" class="carousel-dot${activeClass}" data-index="${i}" role="tab" aria-selected="${selected}" aria-label="Avaliação ${i + 1} de ${reviews.length}"></button>`;
}).join('\n');

const fullSectionInner = `          <!-- Carrossel Horizontal de Avaliações -->
          <div class="reviews-carousel" aria-roledescription="carousel" aria-label="Avaliações reais de mentorados no Google">
            <div class="reviews-carousel-track" id="reviewsTrack">
${slidesHtml}
            </div>
          </div>

          <!-- Indicadores de Pontos (Dots) -->
          <div class="carousel-dots" id="reviewsDots" role="tablist" aria-label="Navegar entre avaliações">
${dotsHtml}
          </div>`;

fs.writeFileSync(path.join(__dirname, '..', 'scratch_reviews_inner.html'), fullSectionInner, 'utf8');
console.log('HTML gerado com sucesso!');
