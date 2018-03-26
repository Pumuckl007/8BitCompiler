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
    this.outputRegister = new Register(8);
    this.counter = new Counter(8);

    this.microInstruction = 0;
    this.halt = false;
    this.instructions = Instructions;
  }

  step(){
    if(this.halt){
      return;
    }
    if(this.microInstruction === 0){
      let bus = this.counter.getValue();
      this.mAR.setValue(bus);
    } else if(this.microInstruction === 1){
      let bus = this.memory.getValue(true);
      this.instructionRegister.setValue(bus);
      this.counter.increment();
    } else {

    }
    this.microInstruction ++;
    if(this.microInstruction > 6){
      this.microInstruction = 0;
    }
  }

}

export default Computer;
