#define WRITE 21
#define INSTRUCTION 20
#define LOWADDR 22
#define LOWDATA 23

#define DELAY 10

int i = 0;

void setup() {
  pinMode(WRITE, OUTPUT);
  pinMode(INSTRUCTION, OUTPUT);
  for (i = 0; i < 8; i++) {
    pinMode(LOWADDR + i * 2, OUTPUT);
    pinMode(LOWDATA + i * 2, OUTPUT);
  }
  Serial.begin(57600);
}

uint8_t code[512];

int instruction = 0;
int data = 0;
int codeLength = -1;

int incomingByte = 0;
int bytesRecived = 0;

void loop() {

  if(bytesRecived/2 == codeLength){
    programCode(code, codeLength);
    cycleAddresses();
    bytesRecived = 0;
    codeLength = -1;
  }
  
  if (Serial.available() > 0) {

    incomingByte = Serial.read();
    
    if(codeLength == -1){
      codeLength = incomingByte+1;
      if(codeLength > 256){
        Serial.print("WARNING - CODE TOO LONG, TRUNKCATING TO LENGTH OF ");
        codeLength = 256;
        Serial.println(codeLength, DEC);
      }
      Serial.print("Code will be ");
      Serial.print(codeLength, DEC);
      Serial.println(" instructions");
    } else {
      code[bytesRecived] = incomingByte;
      bytesRecived ++;
    }
  }

}

void programCode(uint8_t code[], int codeLength){
  for (i = 0; i < codeLength; i++) {
    instruction = code[i * 2];
    data = code[i * 2 + 1];
    writeCode(i, instruction, data);
    Serial.print(i);
    Serial.print(": ");
    Serial.print(instruction, BIN);
    Serial.print(" ");
    Serial.println(data, BIN);
  }
}

void cycleAddresses() {
  digitalWrite(INSTRUCTION, LOW);
  for (i = 0; i < 16; i++) {
    setAddr(i);
    delay(2000);
  }
  digitalWrite(INSTRUCTION, HIGH);
  for (i = 0; i < 16; i++) {
    setAddr(i);
    delay(2000);
  }
}

void writeCode(int addr, int instruction, int data) {
  digitalWrite(WRITE, LOW);
  setAddr(addr);
  setData(data);
  digitalWrite(INSTRUCTION, LOW);
  delay(DELAY);
  digitalWrite(WRITE, HIGH);
  delay(DELAY);
  digitalWrite(WRITE, LOW);
  setData(instruction);
  digitalWrite(INSTRUCTION, HIGH);
  delay(DELAY);
  digitalWrite(WRITE, HIGH);
  delay(DELAY);
  digitalWrite(WRITE, LOW);
}

void setAddr(int addr) {
  for (int k = 0; k < 8; k++) {
    digitalWrite(LOWADDR + k * 2, addr % 2);
    addr = addr >> 1;
  }
}

void setData(int data) {
  for (int k = 0; k < 8; k++) {
    digitalWrite(LOWDATA + k * 2, data % 2);
    data = data >> 1;
  }
}
