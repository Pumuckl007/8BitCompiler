class Counter {

  constructor(width){
    this.width = width;
    this.mask = Math.pow(2, this.width)-1;
    this.value = 0;
  }

  getValue(){
    return this.value;
  }

  setValue(newValue){
    this.value = newValue & this.mask;
  }

  increment(){
    this.value = (this.value + 1) & this.mask;
  }

  clear(){
    this.value = 0;
  }
  
}

export default Counter;
