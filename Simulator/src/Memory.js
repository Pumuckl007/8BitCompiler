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
    if(this.listener && this.data[address] !== newValue){
      this.listener.ramUpdated();
    }
    this.data[address] = newValue;
  }

  setValues(ram){
    if(this.listener){
      this.listener.ramUpdated();
    }
    this.data = ram;
    for(let i = 0; i<this.data.length; i++){
      if(typeof this.data[i] === 'undefined'){
        this.data[i] = this.mask;
      }
      this.data[i] = this.data[i] & this.mask;
    }
  }
  addEventListener(listener){
    this.listener = listener;
  }

}

export default Memory;
