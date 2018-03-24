********************************************************************************
*                           Prime Number Example                               *
*                                                                              *
*     This program computes the prime numbers in a given range. It does this   *
*   by checking whether each number in that range is divisible by a number     *
*   smaller than it but larger than one.                                       *
*                                                                              *
********************************************************************************


LDI 1         * Start of the range to check
STA 255       * Store this in 255 which will be the counter for the a loop
LDI 1         * Load the constant 1 which is used for incrementing
STA 254       * Address 254 will contain this value
LDI 113       * The end of the range to check
STA 253       * Address 254 will be used to determine when to break out of a

a:            * The outer loop which iterates the numbers in the given range.
LDA 255       * Load address 255 which contains the loop counter.
SUB 253       * subtract the ending bound of the range, this will result in a
JEZ end       * negative number unless the loop has reached the desired value
              * in which case we jump.
LDA 255       * Load the counter for the loop.
ADD 254       * Increment the counter by one.
STA 255       * Update the stored value of the counter

LDI 2         * Load and store the starting location for the inner loop, this
STA 252       * is the first divisor we will use. In addition this value is used
              * as a counter for the inner loop.
b:
SUB 255       * Subtract the outer loop's counter to determine if the inner loop
JGZ aend      * should exit.
JEZ aend
LDA 252       * Load the inner loop counter.
STA 250       * Store it in memory location 250 which the modulo routine uses as
              * the divisor.
LDA 255       * Load the outer loop counter which will be used as the dividend.
JMP modulo    * Jump to the modulo sequence. This will leave a modulo %250 in
              * memory location 251. "a" refers to the value in the a register
              * and "%250" to the value in memory address 250.
bcont:
LDA 251       * Load the result of a modulo %250 into the a register.
JEZ a         * If the result is zero we know the number is not prime, therefor
              * we jump to the next number.
LDA 252       * Load the inner loop counter.
ADD 254       * Increment the counter by 1.
STA 252       * Save the new value.
JMP b

aend:
LDA 255       * Load the value that is now determined to be prime
OUT           * Output the value
JMP a

modulo:
STA 251       * Store the a register value to preserve the last known good value
SUB 250       * subtract divisor
JGZ modulo    * if dividend is less than zero, exit
JEZ modulo
JMP bcont

end:
HLT
