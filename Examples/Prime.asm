LDI 1        * start range
STA 255
LDI 1
STA 254
LDI 113       * end range
STA 253

a:
LDA 255
SUB 253
JEZ end
LDA 255
ADD 254
STA 255

LDI 2        * should be 2
STA 252
b:
SUB 255
JGZ aend
JEZ aend
LDA 252
STA 250       * divisor
LDA 255
JMP modulo

bcont:
LDA 251
JEZ a
LDA 252
ADD 254
STA 252
JMP b

aend:
LDA 255
OUT
JMP a

modulo:
STA 251
SUB 250       * subtract divisor
JGZ modulo    * if dividend is less than zero, exit
JEZ modulo
JMP bcont

end:
HLT
