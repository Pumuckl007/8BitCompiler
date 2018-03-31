class SumRegister {

  constructor(width, aRegister, bRegister){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.aRegister = aRegister;
    this.bRegister = bRegister;
  }

  getValue(subtraction){
    if(subtraction){
      let result = this.aRegister.getValue() - this.bRegister.getValue();
      return result & this.mask;
    } else {
      let result = this.aRegister.getValue() + this.bRegister.getValue();
      return result & this.mask;
    }
  }

}

export default SumRegister;
