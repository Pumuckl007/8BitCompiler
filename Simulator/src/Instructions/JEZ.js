import Instruction from "./Instruction.js";

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

export default JEZ;
