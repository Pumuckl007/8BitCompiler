import Instruction from "./Instruction.js";

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

export default JGZ;
