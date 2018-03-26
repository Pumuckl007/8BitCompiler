import Instruction from "./Instruction.js";

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

export default LDA;
