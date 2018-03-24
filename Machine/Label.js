// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

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
