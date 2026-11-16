import fs from 'node:fs';

const microbes = JSON.parse(fs.readFileSync('data/microbes.json', 'utf8'));
console.log(`Count: ${microbes.length}`);
microbes.forEach(m => console.log(`${m.id} | ${m.name} | ${m.thaiName} [${m.category}]`));
