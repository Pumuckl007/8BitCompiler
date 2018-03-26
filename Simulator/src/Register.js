class Register {

  constructor(width, startLocation=0){
    this.value = 0;
    this.width = width;
    this.startLocation = startLocation;
    this.mask = Math.pow(2, this.width)-1;
    this.mask = this.mask << this.startingLocation;
  }

  getValue(){
    return this.value;
  }

  setValue(newValue){
    this.value = newValue & this.mask;
  }

  clear(){
    this.value = 0;
  }

  getWidth(){
    return this.width;
  }

}

export default Register;
