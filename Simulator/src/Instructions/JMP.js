import Instruction from "./Instruction.js";

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

export default JMP;
