import Instruction from "./Instruction.js";

class OUT extends Instruction{

  step(microInstruction, computer){
    if(microInstruction === 2){
      let bus = computer.aRegister.getValue();
      computer.outputRegister.setValue(bus);
      console.log("OUTPUT: " + bus);
    }
  }

}

export default OUT;
