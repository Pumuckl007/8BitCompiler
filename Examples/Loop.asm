********************************************************************************
*                                                                              *
*      (c) 2018 Max Apodaca                                                    *
*      This code is licensed under MIT license (see LICENSE for details)       *
*                                                                              *
********************************************************************************

LDI 1       * Load the value one which will be used for subtracting.
STA 255
LDI 100     * Load the starting value.

            * Label the following instruction with "loop" which can be referenced
loop:       * in jump instructions.
SUB 255     * Subtract one.
OUT         * Output the result.
JMP loop    * Jump to the label "loop".
