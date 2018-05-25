'use strict';

class Register {

  constructor(width, startLocation=0){
    this.value = 0;
    this.width = width;
    this.startLocation = startLocation;
    this.mask = Math.pow(2, this.width)-1;
    this.mask = this.mask << this.startingLocation;
  }

  getValue(){
    return this.value;
  }

  setValue(newValue){
    this.value = newValue & this.mask;
  }

  clear(){
    this.value = 0;
  }

  getWidth(){
    return this.width;
  }

}

class SumRegister {

  constructor(width, aRegister, bRegister){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.aRegister = aRegister;
    this.bRegister = bRegister;
  }

  getValue(subtraction){
    if(subtraction){
      let result = this.aRegister.getValue() - this.bRegister.getValue();
      return result & this.mask;
    } else {
      let result = this.aRegister.getValue() + this.bRegister.getValue();
      return result & this.mask;
    }
  }

}

class Memory {

  constructor(width, mAR){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.mAR = mAR;
    this.data = [];
  }

  getValue(instructionBit = false){
    let address = this.mAR.getValue();
    if(instructionBit){
      address = address | (0b1 << this.mAR.getWidth());
    }
    if(typeof this.data[address] === 'undefined'){
      this.data[address] = this.mask;
    }
    return this.data[address];
  }

  setValue(newValue, instructionBit = false){
    newValue = newValue & this.mask;
    let address = this.mAR.getValue();
    if(instructionBit){
      address = address | (0b1 << this.mAR.getWidth());
    }
    if(this.listener && this.data[address] !== newValue){
      this.listener.ramUpdated();
    }
    this.data[address] = newValue;
  }

  setValues(ram){
    if(this.listener){
      this.listener.ramUpdated();
    }
    this.data = ram;
    for(let i = 0; i<this.data.length; i++){
      if(typeof this.data[i] === 'undefined'){
        this.data[i] = this.mask;
      }
      this.data[i] = this.data[i] & this.mask;
    }
  }
  addEventListener(listener){
    this.listener = listener;
  }

}

class Counter {

  constructor(width){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.value = 0;
  }

  getValue(){
    return this.value;
  }

  setValue(newValue){
    this.value = newValue & this.mask;
  }

  increment(){
    this.value = (this.value + 1) & this.mask;
  }

  clear(){
    this.value = 0;
  }
  
}

class Instruction{

  step(microInstruction, computer){

  }

}

class LDA extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let bus = computer.dataRegister.getValue();
      computer.mAR.setValue(bus);
    } else if(microInstruction === 4){
      let bus = computer.memory.getValue();
      computer.aRegister.setValue(bus);
    }
  }

}

class ADD extends Instruction{

  step(microInstruction, computer){
      if(microInstruction == 2){
        let bus = computer.memory.getValue();
        computer.dataRegister.setValue(bus);
      } else if(microInstruction == 3){
        let bus = computer.dataRegister.getValue();
        computer.mAR.setValue(bus);
      } else if(microInstruction == 4){
        let bus = computer.memory.getValue();
        computer.bRegister.setValue(bus);
      } else if(microInstruction == 5){
        let bus = computer.sumRegister.getValue(false);
        computer.aRegister.setValue(bus);
      }
  }

}

class SUB extends Instruction{

  step(microInstruction, computer){
      if(microInstruction == 2){
        let bus = computer.memory.getValue();
        computer.dataRegister.setValue(bus);
      } else if(microInstruction == 3){
        let bus = computer.dataRegister.getValue();
        computer.mAR.setValue(bus);
      } else if(microInstruction == 4){
        let bus = computer.memory.getValue();
        computer.bRegister.setValue(bus);
      } else if(microInstruction == 5){
        let bus = computer.sumRegister.getValue(true);
        computer.aRegister.setValue(bus);
      }
  }

}

class STA extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let bus = computer.dataRegister.getValue();
      computer.mAR.setValue(bus);
    } else if(microInstruction === 4){
      let bus = computer.aRegister.getValue();
      computer.memory.setValue(bus);
    }
  }

}

class LDI extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let bus = computer.dataRegister.getValue();
      computer.aRegister.setValue(bus);
    }
  }

}

class JMP extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let bus = computer.dataRegister.getValue();
      computer.counter.setValue(bus);
    }
  }

}

class JEZ extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let condition = computer.aRegister.getValue();
      if(condition === 0){
        let bus = computer.dataRegister.getValue();
        computer.counter.setValue(bus);
      }
    }
  }

}

class JGZ extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.memory.getValue();
      computer.dataRegister.setValue(bus);
    } else if(microInstruction === 3){
      let condition = computer.aRegister.getValue();
      let antiMask = computer.aRegister.mask >>> 1;
      if((condition & (~antiMask)) === 0){
        let bus = computer.dataRegister.getValue();
        computer.counter.setValue(bus);
      }
    }
  }

}

class OUT extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.aRegister.getValue();
      computer.outputRegister.setValue(bus);
      console.log("OUTPUT: " + bus);
    }
  }

}

class HLT extends Instruction{

  step(microInstruction, computer){
    computer.halt = true;
  }

}

let instructions = {
  0b0000: new Instruction(),
  0b0001: new LDA(),
  0b0010: new ADD(),
  0b0011: new SUB(),
  0b0100: new STA(),
  0b0101: new LDI(),
  0b0110: new JMP(),
  0b0111: new JEZ(),
  0b1000: new JGZ(),
  0b1110: new OUT(),
  0b1111: new HLT()
};

class Computer {

  constructor(){
    this.aRegister = new Register(8);
    this.bRegister = new Register(8);
    this.sumRegister = new SumRegister(8, this.aRegister, this.bRegister);
    this.instructionRegister = new Register(4, 4);
    this.dataRegister = new Register(8);
    this.mAR = new Register(8);
    this.memory = new Memory(8, this.mAR);
    this.memory.addEventListener(this);
    this.outputRegister = new Register(8);
    this.counter = new Counter(8);

    this.microInstruction = 0;
    this.halt = false;
    this.instructions = instructions;
    this.listeners = [];
  }

  step(){
    if(this.halt){
      return;
    }
    if(this.microInstruction === 0){
      let bus = this.counter.getValue();
      this.mAR.setValue(bus);
      this.emitEvent("next-instruction", bus);
    } else if(this.microInstruction === 1){
      let bus = this.memory.getValue(true);
      this.instructionRegister.setValue(bus);
      this.counter.increment();
    } else {
      let instructionNumber = this.instructionRegister.getValue();
      if(this.instructions[instructionNumber]){
        this.instructions[instructionNumber].step(this.microInstruction, this);
      }
    }
    this.microInstruction ++;
    if(this.microInstruction > 5){
      this.microInstruction = 0;
    }
    this.emitEvent("step-done");
  }

  setRam(ram){
    this.memory.setValues(ram);
  }

  reset(){
    this.microInstruction = 0;
    this.counter.clear();
    this.aRegister.clear();
    this.bRegister.clear();
    this.instructionRegister.clear();
    this.dataRegister.clear();
    this.outputRegister.clear();
    this.mAR.clear();
    this.halt = false;
  }

  ramUpdated(){
    this.emitEvent("ram-written");
  }

  addEventListener(listener){
    this.listeners.push(listener);
  }

  emitEvent(id, data){
    for(let listener of this.listeners){
      listener.onEvent(id, data);
    }
  }

}

// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

class Label {
  constructor(name, line) {
    this.name = name;
    this.line = line;
  }

  getName() {
    return this.name;
  }

  getLine() {
    return this.line;
  }

  toString() {
    return this.name + ": ";
  }
}

// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

var InstructionMap = {
  "NOP": 0b0000,
  "LDA": 0b0001,
  "ADD": 0b0010,
  "SUB": 0b0011,
  "STA": 0b0100,
  "LDI": 0b0101,
  "JMP": 0b0110,
  "JEZ": 0b0111,
  "JGZ": 0b1000,
  "OUT": 0b1110,
  "HLT": 0b1111,
};

class Instruction$1 {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.needsEval = isNaN(data);
  }

  getName() {
    return this.name;
  }

  getData() {
    return this.data;
  }

  evalData(newData) {
    this.needsEval = false;
    this.data = newData;
  }

  getBytes() {
    let bytes = new Uint8Array(2);
    bytes.set([InstructionMap[this.name]], 0);
    bytes.set([this.data], 1);
    return bytes;
  }

  toString() {
    return this.name + " " + this.data;
  }
}

// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

class Assembly {
  constructor() {
    this.instructions = [];
    this.labelMap = [];
    this.labels = [];
  }

  addLabel(label) {
    this.labelMap[label.getName()] = label;
    this.labels.push(label);
  }

  addInstruction(instruction) {
    this.instructions.push(instruction);
  }

  getInstructions() {
    return this.instructions;
  }

  getLabelLine(labelName) {
    if (this.labelMap[labelName]) {
      return this.labelMap[labelName].getLine();
    }
    console.log("Label " + labelName + " not found.");
  }

  getLabelsForInstruction(line) {
    let labels = [];
    for (let label of this.labels) {
      if (label.getLine() === line) {
        labels.push(label);
      }
    }
    return labels;
  }

  toString() {
    let returnString = "";
    for (let i = 0; i < this.instructions.length; i++) {
      let instruction = this.instructions[i];
      let labels = this.getLabelsForInstruction(i);
      returnString += (i) + ": ";
      for (let label of labels) {
        returnString += label.toString() + " ";
      }
      returnString += instruction.toString() + "\n";
    }
    return returnString;
  }

  getBytes() {
    let bytes = new Uint8Array(this.instructions.length * 2);
    for (let i = 0; i < this.instructions.length; i++) {
      let instruction = this.instructions[i];
      if (instruction.needsEval) {
        let line = this.getLabelLine(instruction.getData());
        instruction.evalData(line);
      }
      bytes.set(instruction.getBytes(), i * 2);
    }
    return bytes;
  }
}

// (c) 2018 Max Apodaca

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
    let instruction = new Instruction$1(command, data);
    assembly.addInstruction(instruction);
    if(breakpoints[i]){
      breakpointMap[assembly.getInstructions().length - 1] = true;
    }
    lineMap[assembly.getInstructions().length - 1] = i;
  }

  return [assembly, breakpointMap, lineMap];
}

let examples = {
  "add": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 12\nSTA 200\nLDI 8\nADD 200\nOUT\nHLT\n",
  "divide": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 120       * The dividend\nSTA 255\nLDI 10        * The divisor\nSTA 254\nLDI 1         * constant one for subtraction\nSTA 253\nLDI 0         * reset accumulator to zero\nSTA 252\n\ndivide:\nLDA 255       * Load the dividend into the A register\nSUB 254       * subtract divisor\nJGZ skip      * if dividend is zero end the program\nJEZ skip\nJMP end\nskip: STA 255 * save the number\nLDA 252       * load the accumulator\nADD 253       * add one to the accumulator\nSTA 252       * save the result\nJMP divide    * repeat until divisor number to multiply is zero\n\nend:\nLDA 252       * load accumulator\nOUT           * output result\nHLT\n",
  "fibonacci": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 233     * Load 233, the maximum value\nSTA 253\nLDI 1       * Load 1, the starting value\nOUT         * Set the display to display 1\nSTA 255\nSTA 254\n\nloop:\nADD 255     * Add 255 to compute second digit\nOUT\nSTA 255\nSUB 253     * Subtract 233 to see if we are at the maximum number\nJEZ end     * If we are then jump to end\nLDA 255     * revert to old value\nADD 254     * the next set of instructions repeats the above with the other\nOUT         * register which allows for the previous value to be used.\nSTA 254\nSUB 253\nJEZ end\nLDA 254\nJMP loop\n\nend:\nHLT         * stop execution\n",
  "loop": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 1       * Load the value one which will be used for subtracting.\nSTA 255\nLDI 100     * Load the starting value.\n\n            * Label the following instruction with \"loop\" which can be referenced\nloop:       * in jump instructions.\nSUB 255     * Subtract one.\nOUT         * Output the result.\nJMP loop    * Jump to the label \"loop\".\n",
  "modulo": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 98       * The dividend\nSTA 255\nLDI 45        * The divisor\nSTA 254\nLDI 1         * constant one for subtraction\nSTA 253\nLDI 0         * reset accumulator to zero\nSTA 252\n\ndivide:\nLDA 255       * Load the dividend into the A register\nSUB 254       * subtract divisor\nJGZ skip      * if dividend is zero end the program\nJEZ skip\nJMP end\nskip: STA 255 * save the number\nLDA 252       * load the accumulator\nADD 253       * add one to the accumulator\nSTA 252       * save the result\nJMP divide    * repeat until divisor number to multiply is zero\n\nend:\nLDA 255       * load remaining dividend\nOUT           * output result\nHLT\n",
  "multiply": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\nLDI 8         * First number to multiply\nSTA 255\nLDI 8         * second number to multiply\nSTA 254\nLDI 1         * constant one for subtraction\nSTA 253\nLDI 0         * reset accumulator to zero\nSTA 252\n\nmultiply:\nLDA 255       * Load the first number to multiply into a\nJEZ end       * if it is zero end the program\nSUB 253       * subtract 1\nSTA 255       * save the number\nLDA 252       * load the accumulator\nADD 254       * add the second number to multiply\nSTA 252       * save the result\nJMP multiply  * repeat until first number to multiply is zero\n\nend:\nLDA 252       * load accumulator\nOUT           * output result\nHLT\n",
  "prime": "********************************************************************************\n*                                                                              *\n*      (c) 2018 Max Apodaca                                                    *\n*      This code is licensed under MIT license (see LICENSE for details)       *\n*                                                                              *\n********************************************************************************\n\n********************************************************************************\n*                           Prime Number Example                               *\n*                                                                              *\n*     This program computes the prime numbers in a given range. It does this   *\n*   by checking whether each number in that range is divisible by a number     *\n*   smaller than it but larger than one.                                       *\n*                                                                              *\n********************************************************************************\n\n\nLDI 1         * Start of the range to check\nSTA 255       * Store this in 255 which will be the counter for the a loop\nLDI 1         * Load the constant 1 which is used for incrementing\nSTA 254       * Address 254 will contain this value\nLDI 113       * The end of the range to check\nSTA 253       * Address 254 will be used to determine when to break out of a\n\na:            * The outer loop which iterates the numbers in the given range.\nLDA 255       * Load address 255 which contains the loop counter.\nSUB 253       * subtract the ending bound of the range, this will result in a\nJEZ end       * negative number unless the loop has reached the desired value\n              * in which case we jump.\nLDA 255       * Load the counter for the loop.\nADD 254       * Increment the counter by one.\nSTA 255       * Update the stored value of the counter\n\nLDI 2         * Load and store the starting location for the inner loop, this\nSTA 252       * is the first divisor we will use. In addition this value is used\n              * as a counter for the inner loop.\nb:\nSUB 255       * Subtract the outer loop's counter to determine if the inner loop\nJGZ aend      * should exit.\nJEZ aend\nLDA 252       * Load the inner loop counter.\nSTA 250       * Store it in memory location 250 which the modulo routine uses as\n              * the divisor.\nLDA 255       * Load the outer loop counter which will be used as the dividend.\nJMP modulo    * Jump to the modulo sequence. This will leave a modulo %250 in\n              * memory location 251. \"a\" refers to the value in the a register\n              * and \"%250\" to the value in memory address 250.\nbcont:\nLDA 251       * Load the result of a modulo %250 into the a register.\nJEZ a         * If the result is zero we know the number is not prime, therefor\n              * we jump to the next number.\nLDA 252       * Load the inner loop counter.\nADD 254       * Increment the counter by 1.\nSTA 252       * Save the new value.\nJMP b\n\naend:\nLDA 255       * Load the value that is now determined to be prime\nOUT           * Output the value\nJMP a\n\nmodulo:\nSTA 251       * Store the a register value to preserve the last known good value\nSUB 250       * subtract divisor\nJGZ modulo    * if dividend is less than zero, exit\nJEZ modulo\nJMP bcont\n\nend:\nHLT\n"
};

let modes = {
  "paused": "paused",
  "run": "run",
  "debug": "debug"
};

class Editor {
  constructor(computer) {
    let self = this;
    this.computer = computer;
    this.breakpoints = [];
    this.mode = modes.paused;
    this.running = false;
    this.debugMode = false;
    this.previousActiveLine = -1;

    this.codeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: true,
      mode: "gas",
      gutters: ["breakpoints", "CodeMirror-linenumbers"],
      lineWrapping: true,
      viewportMargin: Infinity
    });

    let makeMarker = function makeMarker() {
      var marker = document.createElement("div");
      marker.style.color = "#2863e6";
      marker.innerHTML = "●";
      return marker;
    };

    this.codeMirror.on("gutterClick", function(cm, n) {
      let info = cm.lineInfo(n);
      if (!info.gutterMarkers) {
        info.handle.on("delete", function() {
          self.breakpoints[n] = false;
        });
      }
      self.breakpoints[info.line] = info.gutterMarkers ? false : true;
      cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
    });

    this.compileButton = document.getElementById("compile");
    this.debugButton = document.getElementById("debug");
    this.stepButton = document.getElementById("step");
    this.runButton = document.getElementById("run");
    this.frequencyInput = document.getElementById("frequency");
    this.compileButton.onclick = function() {
      self.upload();
    };
    this.debugButton.onclick = function() {
      self.debug();
    };
    this.stepButton.onclick = function() {
      self.step();
    };
    this.runButton.onclick = function() {
      self.toggleRun();
    };
    this.frequencyInput.onchange = function(e) {
      let frequency = parseInt(self.frequencyInput.value);
      if (!isNaN(frequency) && frequency >= 0) {
        self.setFrequency(frequency);
      } else {
        self.setFrequency(1);
      }
    };
    this.computer.addEventListener(this);
    this.lineMap = [];
    this.timerDelay = 100;
    this.timesRepeated = 1;
    this.activeLine = -1;
    this.repeatFunction = function() {
      for (let i = 0; i < self.timesRepeated && self.running; i++) {
        self.step();
      }
      self.renderLine();
      let delayTime =  (self.timerDelay < 1) ? 1 : self.timerDelay;
      delayTime = (self.running && !self.computer.halt) ? delayTime : 200;
      setTimeout(self.repeatFunction, delayTime);
    };
    this.repeatFunction();

    this.about = document.getElementById("about");
    this.aboutClose = document.getElementById("about-close");
    this.aboutOpen = document.getElementById("about-open");
    this.aboutClose.onclick = function(){self.closeAbout();};
    this.aboutOpen.onclick = function(){self.openAbout();};
    if(localStorage.readAbout !== "true"){
      self.openAbout();
    }

    this.load = document.getElementById("load-menu");
    this.loadOpen = document.getElementById("load-example");
    this.loadOpen.onclick = function(){
      self.openLoad();
    };
    this.loadClose = document.getElementById("load-close");
    this.loadClose.onclick = function(){ self.closeLoad(); };

    this.loadExamples = document.querySelectorAll(".example-load");
    for(let loadButton of this.loadExamples){
      loadButton.onclick = function(e){self.loadExample(e.target.id);};
    }
    this.upload();

    window.addEventListener('resize', function(){
      self.updateSize();
    });
  }

  updateSize(){
    let editorWrapper = document.getElementById("editor-wrapper");
    this.codeMirror.setSize(editorWrapper.offsetWidth, editorWrapper.offsetHeight);
    console.log(editorWrapper.offsetWidth, editorWrapper.offsetHeight);
  }

  loadExample(name){
    let exampleText = examples[name];
    if(exampleText){
      this.codeMirror.getDoc().setValue(exampleText);
    }
    this.setStopped();
    this.closeLoad();
    this.highlightLine(-1);
    this.upload();
  }

  openLoad(){
    this.load.style.display = "block";
  }

  closeLoad(){
    this.load.style.display = "none";
  }

  closeAbout(){
    this.about.style.display = "none";
    localStorage.setItem('readAbout', true);
  }

  openAbout(){
    this.about.style.display = "block";
  }

  upload() {
    let bytesAndBreakpoints = this.compile();
    let bytes = bytesAndBreakpoints[0];
    this.lineMap = bytesAndBreakpoints[2];
    this.breakpointMap = bytesAndBreakpoints[1];
    this.mode = modes.run;
    this.computer.reset();
    let condensed = Array.from(bytes);
    let dilute = [];
    for (let i = 0; i < condensed.length / 2; i++) {
      dilute[i] = condensed[i * 2 + 1];
      dilute[i + 256] = condensed[i * 2];
    }
    this.computer.setRam(dilute);
    this.debugMode = false;
    this.highlightLine(-1);
    this.activeLine = -1;
  }

  debug() {
    this.upload();
    this.mode = modes.debug;
    this.debugMode = true;
  }

  compile() {
    let assemblyAndBreakpoints = this.parse();
    let byteCode = assemblyAndBreakpoints[0].getBytes();
    return [byteCode, assemblyAndBreakpoints[1], assemblyAndBreakpoints[2]];
  }

  parse() {
    let code = this.codeMirror.doc.getValue();
    let assemblyAndBreakpoints = parser(code, this.breakpoints);
    return assemblyAndBreakpoints;
  }

  step() {
    this.computer.step();
  }

  highlightLine(line) {
    let doc = this.codeMirror.getDoc();
    if (this.previousActiveLine !== -1) {
      doc.removeLineClass(this.previousActiveLine, "background", "highlight-line");
    }
    doc.addLineClass(line, "background", "highlight-line");
    if(line !== -1){
      this.codeMirror.scrollIntoView({line:line, char:0});
    }
    this.previousActiveLine = line;
  }

  toggleRun() {
    if (this.running) {
      this.setStopped();
    } else {
      this.setRunning();
    }
  }

  setRunning() {
    this.running = true;
    this.runButton.innerHTML = "⏸";
  }

  setStopped() {
    this.running = false;
    this.runButton.innerHTML = "▶";
  }

  setFrequency(frequency) {
    console.log(frequency);
    if (frequency <= 0) {
      this.setStopped();
      return;
    }
    let quotient = Math.floor(1000 / frequency);
    if (quotient === 0) {
      this.timerDelay = 1;
      this.timesRepeated = Math.round(frequency / 1000);
    } else {
      this.timerDelay = quotient;
      this.timesRepeated = 1;
    }
  }

  renderLine(){
    this.highlightLine(this.activeLine);
  }

  onEvent(eventId, data) {
    if (eventId === "next-instruction") {
      let activeLine = this.lineMap[data];
      if (activeLine || activeLine === 0) {
        this.activeLine = activeLine;
      }
      if (this.debugMode && this.breakpointMap[data]) {
        this.setStopped();
      }
    }
  }
}

class Visualizer {
  constructor(computer) {
    this.computer = computer;
    this.computer.addEventListener(this);

    this.needsUpdate = true;
    this.needsRamUpdate = true;
    this.ramCooldown = 0;

    this.displayDiv = document.getElementById("display");
    this.simpleDiv = document.getElementById("simple");

    this.simpleDisplays = {};
    this.simpleDisplays.MAR = document.getElementById("MAR");
    this.simpleDisplays.Counter = document.getElementById("Counter");
    this.simpleDisplays.Memory = document.getElementById("Memory");
    this.simpleDisplays.ARegister = document.getElementById("A-Register");
    this.simpleDisplays.InstructionRegister = document.getElementById("Instruction-Register");
    this.simpleDisplays.SumRegister = document.getElementById("Sum-Register");
    this.simpleDisplays.DataRegister = document.getElementById("Data-Register");
    this.simpleDisplays.BRegister = document.getElementById("B-Register");
    this.simpleDisplays.MicroInstruction = document.getElementById("Micro-Instruction");
    this.simpleDisplays.Output = document.getElementById("Output");

    this.ramDisplayByteWidth = 8;
    let self = this;
    this.ramBrowser = document.getElementById("ram-browser");
    this.ramDisplay = document.getElementById("ram-display");
    this.ramDisplay.innerHTML = "loading...\n";
    this.codeMirror = CodeMirror.fromTextArea(this.ramDisplay, {
      lineNumbers: true,
      lineWrapping: true,
      readOnly: "nocursor",
      mode: "none",
      lineNumberFormatter: function(line){
        let leftPad = ((line-1)*self.ramDisplayByteWidth < 16) ? "00" :
        (((line-1)*self.ramDisplayByteWidth < 256) ? "0" : "");
        return "0x" + leftPad + ((line-1)*self.ramDisplayByteWidth).toString(16);
      }
    });

    this.codeMirror.on('viewportChange', function(){
      self.updateRamColor();
    });

    window.addEventListener('resize', function(){
      self.needsUpdate = true;
      self.needsRamUpdate = true;
    });

    this.updateFunction = function(){
      if(self.needsUpdate){
        self.updateDisplay();
        self.needsUpdate = false;
      }
      if(self.needsRamUpdate && self.ramCooldown === 0){
        self.updateRam();
        self.needsRamUpdate = false;
        self.ramCooldown = 4;
      }
      requestAnimationFrame(self.updateFunction);
      if(self.ramCooldown > 0){
        self.ramCooldown --;
      }
    };
    this.updateFunction();
  }

  updateRam(){
    let currentScrollInfo = this.codeMirror.getScrollInfo();
    let ram = this.computer.memory.data;
    let byteWidth = this.computeMaxRamWidth();
    this.ramDisplayByteWidth = byteWidth;
    let string = "";
    for(let i = 0; i<512; i++){
      if(!isNaN(ram[i])){
        let fillString = ((ram[i] < 16) ? "0" : "") + ram[i].toString(16);
        string += fillString.toUpperCase();
      } else {
        string += "FF";
      }
      string += ((i+1)%byteWidth === 0 && i !== 511) ? "\n" : " ";
    }
    this.codeMirror.getDoc().setValue(string);
    this.updateRamColor();
    this.codeMirror.scrollTo(null, currentScrollInfo.top);
  }

  updateRamColor(){
    let viewPort = this.codeMirror.getViewport();
    let offset = viewPort.from;
    let lineNumbers = this.ramBrowser.querySelectorAll(".CodeMirror-gutter-elt");
    offset -= (lineNumbers.length % 2);
    let cutoff = 256/this.ramDisplayByteWidth;
    for(let i = 0; i<lineNumbers.length; i++){
      let color = ((i+offset) < cutoff) ? "#fff89c" : "#d5deef";
      lineNumbers[i].style.backgroundColor = color;
    }
  }

  computeMaxRamWidth(){
    let windowWidth = this.ramDisplay.parentElement.offsetWidth;
    if(windowWidth > 1600){
      return 64;
    }
    if(windowWidth > 820){
      return 32;
    }
    if(windowWidth > 450){
      return 16;
    }
    if(windowWidth > 260){
      return 8;
    }
    return 4;
  }

  updateDisplay() {
    let mAR = this.computer.mAR.getValue();
    let counter = this.computer.counter.getValue();
    let memory = this.computer.memory.getValue();
    let aRegister = this.computer.aRegister.getValue();
    let instructionRegister = this.computer.instructionRegister.getValue();
    let sumRegister = this.computer.sumRegister.getValue();
    let dataRegister = this.computer.dataRegister.getValue();
    let bRegister = this.computer.bRegister.getValue();
    let microInstruction = this.computer.microInstruction;
    let output = this.computer.outputRegister.getValue();

    this.simpleDisplays.MAR.innerHTML = mAR;
    this.simpleDisplays.Counter.innerHTML = counter;
    this.simpleDisplays.Memory.innerHTML = memory;
    this.simpleDisplays.ARegister.innerHTML = aRegister;
    this.simpleDisplays.InstructionRegister.innerHTML = instructionRegister;
    this.simpleDisplays.SumRegister.innerHTML = sumRegister;
    this.simpleDisplays.DataRegister.innerHTML = dataRegister;
    this.simpleDisplays.BRegister.innerHTML = bRegister;
    this.simpleDisplays.MicroInstruction.innerHTML = microInstruction;
    this.simpleDisplays.Output.innerHTML = output;
  }

  onEvent(eventId) {
    if (eventId === "step-done") {
      this.needsUpdate = true;
    }
    if (eventId === "ram-written"){
      this.needsRamUpdate = true;
    }
  }
}

window.computer = new Computer();
window.editor = new Editor(window.computer);
window.visualizer = new Visualizer(window.computer);
