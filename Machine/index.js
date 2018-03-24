// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

var fs = require('fs');
var parser = require('./Parser.js');
var serialPortWriter = require('./SerialPortWriter.js');

if(process.argv.length < 4){
  console.log("ERROR: TOO FEW ARGUMENTS");
  return;
}

var data = fs.readFileSync(process.argv[2], 'utf-8');

let assembly = parser(data);
console.log(assembly.toString());
let bytes = assembly.getBytes();

for(let i = 0; i<bytes.length; i+=2){
  console.log((i/2) + ": " + bytes[i].toString(2) + " " + bytes[i+1].toString(2));
}
console.log();

console.log(assembly.toString());

fs.writeFileSync(process.argv[3],new Buffer(bytes));

if(process.argv.length > 4){
  serialPortWriter(process.argv[4], new Buffer(bytes));
}
