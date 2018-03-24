********************************************************************************
*                                                                              *
*      This file is subject to the terms and conditions defined in             *
*      file 'LICENSE', which is in the root directory of this project.         *
*                                                                              *
********************************************************************************

********************************************************************************
*                           Benchmarking Program                               *
*                                                                              *
*     This program runs a certain number of instructions. This number can be   *
*   computed by the expression 9 + a * (7 + b * (6 + c * 5 + 2)) + 1 where     *
*   "a", "b", and "c" are labeled accordingly. You can time how long it takes  *
*   to execute to compute the clock frequency and how many operations per      *
*   per second the computer can compute.                                       *
*                                                                              *
********************************************************************************


LDI 255
STA 255
LDI 1
STA 254
STA 253
LDI 240       * a is 256 - this number
STA 252
LDI 1
STA 250

outer:
LDA 252
JEZ end
ADD 250
OUT
STA 252
LDI 1         * b is 256 - this number
STA 253

mid:
LDA 253
JEZ outer
ADD 250
STA 253
LDI 1         * c is 256 - this number
STA 254

inner:
LDA 254
JEZ mid
ADD 250
STA 254
JMP inner

JMP mid

JMP outer

end:
HLT
