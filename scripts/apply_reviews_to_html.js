const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Update counter from 1 / 4 to 1 / 11
html = html.replace(
  '<span class="carousel-counter" id="reviewsCounter" aria-live="polite">1 / 4</span>',
  '<span class="carousel-counter" id="reviewsCounter" aria-live="polite">1 / 11</span>'
);

// Replace inner carousel and dots
const inner = fs.readFileSync(path.join(__dirname, '..', 'scratch_reviews_inner.html'), 'utf8');
const startMarker = '<!-- Carrossel Horizontal de Avaliações -->';
const endMarker = '<div class="google-panel-footer">';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newHtml = html.slice(0, startIndex) + inner + '\n\n          ' + html.slice(endIndex);
fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('index.html atualizado com as 11 avaliações reais com sucesso!');
