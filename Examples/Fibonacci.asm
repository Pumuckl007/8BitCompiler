********************************************************************************
*                                                                              *
*      (c) 2018 Max Apodaca                                                    *
*      This code is licensed under MIT license (see LICENSE for details)       *
*                                                                              *
********************************************************************************

LDI 233     * Load 233, the maximum value
STA 253
LDI 1       * Load 1, the starting value
OUT         * Set the display to display 1
STA 255
STA 254

loop:
ADD 255     * Add 255 to compute second digit
OUT
STA 255
SUB 253     * Subtract 233 to see if we are at the maximum number
JEZ end     * If we are then jump to end
LDA 255     * revert to old value
ADD 254     * the next set of instructions repeats the above with the other
OUT         * register which allows for the previous value to be used.
STA 254
SUB 253
JEZ end
LDA 254
JMP loop

end:
HLT         * stop execution
