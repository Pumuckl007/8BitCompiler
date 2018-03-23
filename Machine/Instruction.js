var InstructionMap = {
  "NOP":0b0000,
  "LDA":0b0001,
  "ADD":0b0010,
  "SUB":0b0011,
  "STA":0b0100,
  "LDI":0b0101,
  "JMP":0b0110,
  "JEZ":0b0111,
  "JGZ":0b1000,
  "OUT":0b1110,
  "HLT":0b1111,
}

class Instruction {
  constructor(name, data){
    this.name = name;
    this.data = data;
    this.needsEval = isNaN(data);
  }

  getName(){
    return this.name;
  }

  getData(){
    return this.data;
  }

  evalData(newData){
    this.needsEval = false;
    this.data = newData;
  }

  getBytes(){
    let bytes = new Uint8Array(2);
    bytes.set([InstructionMap[this.name]], 0);
    bytes.set([this.data], 1);
    return bytes;
  }

  toString(){
    return this.name + " " + this.data;
  }
}

module.exports = Instruction;
