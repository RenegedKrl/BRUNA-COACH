const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const entries = ['index.html', 'css', 'js', 'assets'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  const destination = path.join(out, entry);
  fs.cpSync(source, destination, { recursive: true });
}

console.log(`Build estático concluído em ${out}`);
