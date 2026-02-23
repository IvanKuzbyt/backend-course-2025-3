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

if (!options.input) {
console.error("Please, specify input file");
process.exit(1);
}

if (!fs.existsSync(options.input)) {
console.error("Cannot find input file");
process.exit(1);
}

const raw = fs.readFileSync(options.input);

const data = JSON.parse(raw);

let result = data;

if (options.airtime) {

result = result.filter(
x => Number(x.AIR_TIME) > Number(options.airtime)
);

}

result = result.map(x => {

let line = "";

if (options.date) {
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