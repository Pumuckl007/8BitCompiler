import Register from "./Register.js";
import SumRegister from "./SumRegister.js";
import Memory from "./Memory.js";
import Counter from "./Counter.js";
import Instructions from "./Instructions/Instructions.js";

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
    this.instructions = Instructions;
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
    if(this.microInstruction > 6){
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

export default Computer;
