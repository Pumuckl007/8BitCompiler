class Memory {

  constructor(width, mAR){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.mAR = mAR;
    this.data = [];
  }

  getValue(instructionBit = false){
    let address = this.mAR.getValue();
    if(instructionBit){
      address = address | (0b1 << this.mAR.getWidth());
    }
    if(typeof this.data[address] === 'undefined'){
      this.data[address] = this.mask;
    }
    return this.data[address];
  }

  setValue(newValue, instructionBit = false){
    newValue = newValue & this.mask;
    let address = this.mAR.getValue();
    if(instructionBit){
      address = address | (0b1 << this.mAR.getWidth());
    }
    this.data[address] = newValue;
  }

}

export default Memory;
