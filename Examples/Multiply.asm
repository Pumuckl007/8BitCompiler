********************************************************************************
*                                                                              *
*      (c) 2018 Max Apodaca                                                    *
*      This code is licensed under MIT license (see LICENSE for details)       *
*                                                                              *
********************************************************************************

LDI 8         * First number to multiply
STA 255
LDI 8         * second number to multiply
STA 254
LDI 1         * constant one for subtraction
STA 253
LDI 0         * reset accumulator to zero
STA 252

multiply:
LDA 255       * Load the first number to multiply into a
JEZ end       * if it is zero end the program
SUB 253       * subtract 1
STA 255       * save the number
LDA 252       * load the accumulator
ADD 254       * add the second number to multiply
STA 252       * save the result
JMP multiply  * repeat until first number to multiply is zero

end:
LDA 252       * load accumulator
OUT           * output result
HLT
