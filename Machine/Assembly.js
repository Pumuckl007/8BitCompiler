// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

class Assembly {
  constructor(){
    this.instructions = [];
    this.labelMap = [];
    this.labels = [];
  }

  addLabel(label){
    this.labelMap[label.getName()] = label;
    this.labels.push(label);
  }

  addInstruction(instruction){
    this.instructions.push(instruction);
  }

  getInstructions(){
    return this.instructions;
  }

  getLabelLine(labelName){
    if(this.labelMap[labelName]){
      return this.labelMap[labelName].getLine();
    }
    console.log("Label " + labelName + " not found.");
  }

  getLabelsForInstruction(line){
    let labels = [];
    for(let label of this.labels){
      if(label.getLine() === line){
        labels.push(label);
      }
    }
    return labels;
  }

  toString(){
    let returnString = "";
    for(let i = 0; i<this.instructions.length; i++){
      let instruction = this.instructions[i];
      let labels = this.getLabelsForInstruction(i);
      returnString += (i) + ": ";
      for(let label of labels){
        returnString += label.toString() + " ";
      }
      returnString += instruction.toString() + "\n";
    }
    return returnString;
  }

  getBytes(){
    let bytes = new Uint8Array(this.instructions.length * 2);
    for(let i = 0; i<this.instructions.length; i++){
      let instruction = this.instructions[i];
      if(instruction.needsEval){
        let line = this.getLabelLine(instruction.getData());
        instruction.evalData(line);
      }
      bytes.set(instruction.getBytes(), i*2);
    }
    return bytes;
  }
}

module.exports = Assembly;
