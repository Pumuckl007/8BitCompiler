********************************************************************************
*                                                                              *
*      This file is subject to the terms and conditions defined in             *
*      file 'LICENSE', which is in the root directory of this project.         *
*                                                                              *
********************************************************************************

LDI 120       * The dividend
STA 255
LDI 10        * The divisor
STA 254
LDI 1         * constant one for subtraction
STA 253
LDI 0         * reset accumulator to zero
STA 252

divide:
LDA 255       * Load the dividend into the A register
SUB 254       * subtract divisor
JGZ skip      * if dividend is zero end the program
JEZ skip
JMP end
skip: STA 255 * save the number
LDA 252       * load the accumulator
ADD 253       * add one to the accumulator
STA 252       * save the result
JMP divide    * repeat until divisor number to multiply is zero

end:
LDA 252       * load accumulator
OUT           * output result
HLT
