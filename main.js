const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>')
  .option('-o, --output <path>')
  .option('-d, --display')
  .option('--date')
  .option('-a, --airtime <number>');

program.parse(process.argv);

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читаємо файл як текст
let raw;
try {
  raw = fs.readFileSync(options.input, 'utf-8');
} catch (err) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Розбиваємо по рядках (NDJSON формат)
const lines = raw
  .split('\n')
  .filter(line => line.trim() !== '');

let data;

try {
  data = lines.map(line => JSON.parse(line));
} catch (err) {
  console.error("Invalid JSON format");
  process.exit(1);
}

// Якщо не задано -o і -d — нічого не робимо
if (!options.output && !options.display) {
  process.exit(0);
}

// Фільтр по airtime
if (options.airtime) {
  data = data.filter(x =>
    x.AIR_TIME && Number(x.AIR_TIME) > Number(options.airtime)
  );
}

// Формування результату
const result = data.map(x => {
  let line = "";

  if (options.date && x.FL_DATE) {
    line += x.FL_DATE + " ";
  }

  line += x.AIR_TIME + " " + x.DISTANCE;

  return line;
});

const output = result.join("\n");

if (options.output) {
  fs.writeFileSync(options.output, output);
}

if (options.display) {
  console.log(output);
}