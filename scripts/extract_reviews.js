const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const links = [
  'https://maps.app.goo.gl/SHgDqsdrCv7h2zWT9',
  'https://maps.app.goo.gl/TzJDeVth8L858QjD8',
  'https://maps.app.goo.gl/n5WKwF79uirJcTev8',
  'https://maps.app.goo.gl/w32ap1B4SWE4EYr87',
  'https://maps.app.goo.gl/V7ygZvpE1qRYGDA9A',
  'https://maps.app.goo.gl/DSoDwAWngZ1fvxs58',
  'https://maps.app.goo.gl/Duaq33qefLkYZyGf8',
  'https://maps.app.goo.gl/YBHfiCcKH7sAYNbaA',
  'https://maps.app.goo.gl/6f7AA277wSY1AqvEA',
  'https://maps.app.goo.gl/tkTt47ZPiKLwRrVq5',
  'https://maps.app.goo.gl/wjddgZGcw1Pb9Vix5'
];

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    // If google usercontent, request larger image size by replacing =w...-h... with =s240-c
    let cleanUrl = url;
    if (cleanUrl.includes('googleusercontent.com')) {
      cleanUrl = cleanUrl.replace(/=w\d+-h\d+[^=]*/, '=s240-c');
    }
    const client = cleanUrl.startsWith('https') ? https : http;
    client.get(cleanUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    headless: true
  });

  const reviewsDir = path.resolve(__dirname, '..', 'assets', 'images', 'reviews');
  fs.mkdirSync(reviewsDir, { recursive: true });

  const results = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log(`[${i + 1}/${links.length}] Acessando ${link}...`);
    const page = await browser.newPage();
    try {
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(4000);

      // Click "Mais" / "Ver mais" if review text is long
      try {
        const moreBtn = await page.$('button[aria-label="Ver mais"], button.w8nwRe');
        if (moreBtn) await moreBtn.click();
      } catch (e) {}

      const reviewData = await page.evaluate(() => {
        // Find avatar image
        const imgEl = document.querySelector('button[data-href*="contrib"] img, img[alt^="Foto de"], .X6tD7d img');
        let author = '';
        if (imgEl && imgEl.alt) {
          author = imgEl.alt.replace(/^Foto de\s+/, '').trim();
        }
        if (!author) {
          const nameEl = document.querySelector('.d4r55, .fontTitleMedium');
          if (nameEl) author = nameEl.innerText.trim();
        }

        // Find review snippet
        const textEl = document.querySelector('.wiI7pd, .MyEned');
        const text = textEl ? textEl.innerText.trim() : '';

        // Find date
        const dateEl = document.querySelector('.rsqaWe');
        const date = dateEl ? dateEl.innerText.trim() : '';

        // Find stars
        const starsEl = document.querySelector('span[role="img"][aria-label*="estrela"]');
        const starsText = starsEl ? starsEl.getAttribute('aria-label') : '5 estrelas';

        return {
          author: author || 'Cliente Mentoria',
          photoUrl: imgEl ? imgEl.src : '',
          text: text,
          date: date || 'recentemente',
          stars: starsText
        };
      });

      reviewData.link = link;
      console.log(`-> Autor: ${reviewData.author} | Data: ${reviewData.date}`);
      console.log(`-> Texto: ${reviewData.text.slice(0, 80)}...`);

      // Download photo
      const slug = reviewData.author
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `review-${i + 1}`;

      const filename = `${slug}.jpg`;
      const localPath = path.join(reviewsDir, filename);

      if (reviewData.photoUrl) {
        try {
          await downloadImage(reviewData.photoUrl, localPath);
          reviewData.localPhoto = `assets/images/reviews/${filename}`;
          console.log(`-> Foto salva em ${reviewData.localPhoto}`);
        } catch (err) {
          console.error(`-> Erro ao baixar foto:`, err.message);
          reviewData.localPhoto = '';
        }
      } else {
        reviewData.localPhoto = '';
      }

      results.push(reviewData);
    } catch (e) {
      console.error(`Erro ao processar ${link}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const outJson = path.resolve(__dirname, '..', 'assets', 'reviews_real.json');
  fs.writeFileSync(outJson, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nConcluído! ${results.length} avaliações extraídas e salvas em ${outJson}`);
})();
