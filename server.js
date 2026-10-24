const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Normalize URL to prevent directory traversal
  let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req.headers.range;
    const commonHeaders = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Accept-Ranges': 'bytes'
    };

    if (req.method === 'HEAD') {
      res.writeHead(200, { ...commonHeaders, 'Content-Length': stats.size });
      res.end();
      return;
    }

    if (range && ext === '.mp4') {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      const start = match && match[1] ? Number(match[1]) : 0;
      const end = match && match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;

      if (!match || start > end || start >= stats.size) {
        res.writeHead(416, { ...commonHeaders, 'Content-Range': `bytes */${stats.size}` });
        res.end();
        return;
      }

      res.writeHead(206, {
        ...commonHeaders,
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Content-Length': end - start + 1
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { ...commonHeaders, 'Content-Length': stats.size });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

let currentPort = Number(PORT);

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`  BRUNA — Mentoria de Carreira e Executiva`);
    console.log(`  Servidor ativo em: http://localhost:${port}`);
    console.log(`======================================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort += 1;
    console.log(`Porta ocupada, tentando porta ${currentPort}...`);
    setTimeout(() => startServer(currentPort), 100);
  } else {
    console.error('Erro no servidor:', err);
  }
});

startServer(currentPort);
