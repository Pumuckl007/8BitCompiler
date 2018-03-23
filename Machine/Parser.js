var Label = require('./Label.js');
var Instruction = require('./Instruction.js');
var Assembly = require('./Assembly.js');

function parser(assemblyCode){
  let assembly = new Assembly();

  let lines = assemblyCode.split('\n');
  for(let i = 0; i<lines.length; i++){
    let line = lines[i].trim();
    while(line.indexOf(':') !== -1){
        let labels = line.split(":", 1);
        line = (labels.length > 1) ? labels[1].trim() : "";
        let labelName = labels[0];
        console.log(labelName);
        let address = assembly.getInstructions().length;
        let label = new Label(labelName, address);
        assembly.addLabel(label);
    }
    if(line === "" || line.charAt(0) === '*'){
      continue;
    }
    let parts = line.split(" ");
    if(parts.length < 1){
      console.log("error while parsing assembly");
      return false;
    }
    let command = parts[0];
    let data = (parts.length > 1) ? parts[1] : "0";
    let instruction = new Instruction(command, data);
    assembly.addInstruction(instruction);
  }

  return assembly;
}

module.exports = parser;
