import NOP from "./NOP.js";
import LDA from "./LDA.js";
import ADD from "./ADD.js";
import SUB from "./SUB.js";
import STA from "./STA.js";
import LDI from "./LDI.js";
import JMP from "./JMP.js";
import JEZ from "./JEZ.js";
import JGZ from "./JGZ.js";
import OUT from "./OUT.js";
import HLT from "./HLT.js";

let instructions = {
  0b0000: new NOP(),
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
}

export default instructions;
