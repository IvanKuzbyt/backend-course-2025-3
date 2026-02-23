const { program } = require('commander');
const fs = require('fs');

program
.requiredOption('-i, --input <path>')
.option('-o, --output <path>')
.option('-d, --display');

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