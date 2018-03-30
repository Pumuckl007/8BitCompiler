class Visualizer {
  constructor(computer) {
    this.computer = computer;
    this.computer.addEventListener(this);

    this.needsUpdate = true;
    this.needsRamUpdate = true;

    this.displayDiv = document.getElementById("display");
    this.simpleDiv = document.getElementById("simple");

    this.simpleDisplays = {};
    this.simpleDisplays.MAR = document.getElementById("MAR");
    this.simpleDisplays.Counter = document.getElementById("Counter");
    this.simpleDisplays.Memory = document.getElementById("Memory");
    this.simpleDisplays.ARegister = document.getElementById("A-Register");
    this.simpleDisplays.InstructionRegister = document.getElementById("Instruction-Register");
    this.simpleDisplays.SumRegister = document.getElementById("Sum-Register");
    this.simpleDisplays.DataRegister = document.getElementById("Data-Register");
    this.simpleDisplays.BRegister = document.getElementById("B-Register");
    this.simpleDisplays.MicroInstruction = document.getElementById("Micro-Instruction")
    this.simpleDisplays.Output = document.getElementById("Output");

    this.ramDisplayByteWidth = 8;
    let self = this;
    this.ramBrowser = document.getElementById("ram-browser");
    this.ramDisplay = document.getElementById("ram-display");
    this.ramDisplay.innerHTML = "loading...\n";
    this.codeMirror = CodeMirror.fromTextArea(this.ramDisplay, {
      lineNumbers: true,
      lineWrapping: true,
      readOnly: "nocursor",
      mode: "none",
      lineNumberFormatter: function(line){
        let leftPad = ((line-1)*self.ramDisplayByteWidth < 16) ? "00" :
        (((line-1)*self.ramDisplayByteWidth < 256) ? "0" : "");
        return "0x" + leftPad + ((line-1)*self.ramDisplayByteWidth).toString(16);
      }
    });

    this.updateFunction = function(){
      if(self.needsUpdate){
        self.updateDisplay();
        self.needsUpdate = false;
      }
      if(self.needsRamUpdate){
        self.updateRam();
        self.needsRamUpdate = false;
      }
      requestAnimationFrame(self.updateFunction);
    }
    this.updateFunction();
  }

  updateRam(){
    let currentScrollInfo = this.codeMirror.getScrollInfo();
    let ram = this.computer.memory.data;
    let byteWidth = this.computeMaxRamWidth();
    this.ramDisplayByteWidth = byteWidth;
    let string = "";
    for(let i = 0; i<512; i++){
      if(!isNaN(ram[i])){
        let fillString = ((ram[i] < 16) ? "0" : "") + ram[i].toString(16);
        string += fillString.toUpperCase();
      } else {
        string += "FF";
      }
      string += ((i+1)%byteWidth === 0 && i !== 511) ? "\n" : " ";
    }
    this.codeMirror.getDoc().setValue(string);
    let lineNumbers = this.ramBrowser.querySelectorAll(".CodeMirror-gutter-elt");
    let cutoff = 256/this.ramDisplayByteWidth;
    for(let i = 0; i<lineNumbers.length; i++){
      let color = (i <= cutoff) ? "#fff89c" : "#d5deef";
      lineNumbers[i].style.backgroundColor = color;
    }
    this.codeMirror.scrollTo(null, currentScrollInfo.top);
  }

  computeMaxRamWidth(){
    let windowWidth = this.ramDisplay.parentElement.offsetWidth;
    if(windowWidth > 1600){
      return 64;
    }
    if(windowWidth > 820){
      return 32;
    }
    if(windowWidth > 450){
      return 16;
    }
    if(windowWidth > 260){
      return 8;
    }
    return 4;
  }

  updateDisplay() {
    let mAR = this.computer.mAR.getValue();
    let counter = this.computer.counter.getValue();
    let memory = this.computer.memory.getValue();
    let aRegister = this.computer.aRegister.getValue();
    let instructionRegister = this.computer.instructionRegister.getValue();
    let sumRegister = this.computer.sumRegister.getValue();
    let dataRegister = this.computer.dataRegister.getValue();
    let bRegister = this.computer.bRegister.getValue();
    let microInstruction = this.computer.microInstruction;
    let output = this.computer.outputRegister.getValue();

    this.simpleDisplays.MAR.innerHTML = mAR;
    this.simpleDisplays.Counter.innerHTML = counter;
    this.simpleDisplays.Memory.innerHTML = memory;
    this.simpleDisplays.ARegister.innerHTML = aRegister;
    this.simpleDisplays.InstructionRegister.innerHTML = instructionRegister;
    this.simpleDisplays.SumRegister.innerHTML = sumRegister;
    this.simpleDisplays.DataRegister.innerHTML = dataRegister;
    this.simpleDisplays.BRegister.innerHTML = bRegister;
    this.simpleDisplays.MicroInstruction.innerHTML = microInstruction;
    this.simpleDisplays.Output.innerHTML = output;
  }

  onEvent(eventId) {
    if (eventId === "step-done") {
      this.needsUpdate = true;
    }
    if (eventId === "ram-written"){
      this.needsRamUpdate = true;
    }
  }
}

export default Visualizer;
