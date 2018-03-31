// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

import Label from './Label.js';
import Instruction from './Instruction.js';
import Assembly from './Assembly.js';

function parser(assemblyCode, breakpoints) {
  let assembly = new Assembly();
  let breakpointMap = [];
  let lineMap = [];

  let lines = assemblyCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    while (line.indexOf(':') !== -1) {
      let labels = line.split(":", 2);
      line = (labels.length > 1) ? labels[1].trim() : "";
      let labelName = labels[0];
      let address = assembly.getInstructions().length;
      let label = new Label(labelName, address);
      assembly.addLabel(label);
    }
    if (line === "" || line.charAt(0) === '*') {
      continue;
    }
    let parts = line.split(" ");
    if (parts.length < 1) {
      console.log("error while parsing assembly");
      return false;
    }
    let command = parts[0];
    let data = (parts.length > 1) ? parts[1] : "0";
    let instruction = new Instruction(command, data);
    assembly.addInstruction(instruction);
    if(breakpoints[i]){
      breakpointMap[assembly.getInstructions().length - 1] = true;
    }
    lineMap[assembly.getInstructions().length - 1] = i;
  }

  return [assembly, breakpointMap, lineMap];
}

export default parser;
