********************************************************************************
*                                                                              *
*      (c) 2018 Max Apodaca                                                    *
*      This code is licensed under MIT license (see LICENSE for details)       *
*                                                                              *
********************************************************************************

LDI 98       * The dividend
STA 255
LDI 45        * The divisor
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
LDA 255       * load remaining dividend
OUT           * output result
HLT
