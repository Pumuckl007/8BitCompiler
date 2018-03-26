import Instruction from "./Instruction.js";

class HLT extends Instruction{

  step(microInstruction, computer){
    computer.halt = true;
  }

}

export default HLT;
