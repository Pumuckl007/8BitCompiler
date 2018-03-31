import Parser from "./Compiler/Parser.js";
import ExampleMap from "./ExampleMap.js";

let modes = {
  "paused": "paused",
  "run": "run",
  "debug": "debug"
}

class Editor {
  constructor(computer) {
    let self = this;
    this.computer = computer;
    this.breakpoints = [];
    this.mode = modes.paused;
    this.running = false;
    this.debugMode = false;
    this.previousActiveLine = -1;

    this.codeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: true,
      mode: "gas",
      gutters: ["breakpoints", "CodeMirror-linenumbers"],
      lineWrapping: true
    });

    let makeMarker = function makeMarker() {
      var marker = document.createElement("div");
      marker.style.color = "#2863e6";
      marker.innerHTML = "●";
      return marker;
    }

    this.codeMirror.on("gutterClick", function(cm, n) {
      let info = cm.lineInfo(n);
      if (!info.gutterMarkers) {
        info.handle.on("delete", function() {
          self.breakpoints[n] = false;
        });
      }
      self.breakpoints[info.line] = info.gutterMarkers ? false : true;
      cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
    });

    this.compileButton = document.getElementById("compile");
    this.debugButton = document.getElementById("debug");
    this.stepButton = document.getElementById("step");
    this.runButton = document.getElementById("run");
    this.frequencyInput = document.getElementById("frequency");
    this.compileButton.onclick = function() {
      self.upload();
    };
    this.debugButton.onclick = function() {
      self.debug();
    };
    this.stepButton.onclick = function() {
      self.step();
    };
    this.runButton.onclick = function() {
      self.toggleRun();
    }
    this.frequencyInput.onchange = function(e) {
      let frequency = parseInt(self.frequencyInput.value);
      if (!isNaN(frequency) && frequency >= 0) {
        self.setFrequency(frequency);
      } else {
        self.setFrequency(1);
      }
    }
    this.computer.addEventListener(this);
    this.lineMap = [];
    this.timerDelay = 1000;
    this.timesRepeated = 1;
    this.activeLine = -1;
    this.repeatFunction = function() {
      for (let i = 0; i < self.timesRepeated && self.running; i++) {
        self.step();
      }
      self.renderLine();
      let delayTime =  (self.timerDelay < 1) ? 1 : self.timerDelay;
      delayTime = (self.running && !self.computer.halt) ? delayTime : 200;
      setTimeout(self.repeatFunction, delayTime);
    }
    this.repeatFunction();

    this.about = document.getElementById("about");
    this.aboutClose = document.getElementById("about-close");
    this.aboutOpen = document.getElementById("about-open");
    this.aboutClose.onclick = function(){self.closeAbout();};
    this.aboutOpen.onclick = function(){self.openAbout();};
    if(localStorage.readAbout === "false"){
      self.openAbout();
    }

    this.load = document.getElementById("load-menu");
    this.loadOpen = document.getElementById("load-example");
    this.loadOpen.onclick = function(){
      self.openLoad();
    }
    this.loadClose = document.getElementById("load-close");
    this.loadClose.onclick = function(){ self.closeLoad() };

    this.loadExamples = document.querySelectorAll(".example-load");
    for(let loadButton of this.loadExamples){
      loadButton.onclick = function(e){self.loadExample(e.target.id)};
    }
  }

  loadExample(name){
    let exampleText = ExampleMap[name];
    if(exampleText){
      this.codeMirror.getDoc().setValue(exampleText);
    }
    this.closeLoad();
  }

  openLoad(){
    this.load.style.display = "block";
  }

  closeLoad(){
    this.load.style.display = "none";
  }

  closeAbout(){
    this.about.style.display = "none";
    localStorage.setItem('readAbout', true);
  }

  openAbout(){
    this.about.style.display = "block";
  }

  upload() {
    let bytesAndBreakpoints = this.compile();
    let bytes = bytesAndBreakpoints[0];
    this.lineMap = bytesAndBreakpoints[2];
    this.breakpointMap = bytesAndBreakpoints[1];
    this.mode = modes.run;
    this.computer.reset();
    let condensed = Array.from(bytes);
    let dilute = [];
    for (let i = 0; i < condensed.length / 2; i++) {
      dilute[i] = condensed[i * 2 + 1];
      dilute[i + 256] = condensed[i * 2];
    }
    this.computer.setRam(dilute);
    this.debugMode = false;
    this.highlightLine(-1);
    this.activeLine = -1;
  }

  debug() {
    this.upload();
    this.mode = modes.debug;
    this.debugMode = true;
  }

  compile() {
    let assemblyAndBreakpoints = this.parse();
    let byteCode = assemblyAndBreakpoints[0].getBytes();
    return [byteCode, assemblyAndBreakpoints[1], assemblyAndBreakpoints[2]];
  }

  parse() {
    let code = this.codeMirror.doc.getValue();
    let assemblyAndBreakpoints = Parser(code, this.breakpoints);
    return assemblyAndBreakpoints;
  }

  step() {
    this.computer.step();
  }

  highlightLine(line) {
    let doc = this.codeMirror.getDoc();
    if (this.previousActiveLine !== -1) {
      doc.removeLineClass(this.previousActiveLine, "background", "highlight-line");
    }
    doc.addLineClass(line, "background", "highlight-line");
    if(line !== -1){
      this.codeMirror.scrollIntoView({line:line, char:0});
    }
    this.previousActiveLine = line;
  }

  toggleRun() {
    if (this.running) {
      this.setStopped();
    } else {
      this.setRunning();
    }
  }

  setRunning() {
    this.running = true;
    this.runButton.innerHTML = "⏸";
  }

  setStopped() {
    this.running = false;
    this.runButton.innerHTML = "▶";
  }

  setFrequency(frequency) {
    if (frequency <= 0) {
      this.setStopped();
      return;
    }
    let quotient = Math.floor(1000 / frequency);
    if (quotient === 0) {
      this.timerDelay = 1;
      this.timesRepeated = Math.round(frequency / 1000);
    } else {
      this.timerDelay = quotient;
      this.timesRepeated = 1;
    }
  }

  renderLine(){
    this.highlightLine(this.activeLine);
  }

  onEvent(eventId, data) {
    if (eventId === "next-instruction") {
      let activeLine = this.lineMap[data];
      if (activeLine || activeLine === 0) {
        this.activeLine = activeLine;
      }
      if (this.debugMode && this.breakpointMap[data]) {
        this.setStopped();
      }
    }
  }
}

export default Editor;
