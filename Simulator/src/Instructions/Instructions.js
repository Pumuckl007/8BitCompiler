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
  0b00000000: new NOP(),
  0b00010000: new LDA(),
  0b00100000: new ADD(),
  0b00110000: new SUB(),
  0b01000000: new STA(),
  0b01010000: new LDI(),
  0b01100000: new JMP(),
  0b01110000: new JEZ(),
  0b10000000: new JGZ(),
  0b11100000: new OUT(),
  0b11110000: new HLT()
}

export default instructions;
