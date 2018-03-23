class Label {
  constructor(name, line){
    this.name = name;
    this.line = line;
  }

  getName(){
    return this.name;
  }

  getLine(){
    return this.line;
  }

  toString(){
    return this.name + ": ";
  }
}

module.exports = Label;
