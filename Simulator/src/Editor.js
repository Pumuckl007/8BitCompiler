import Parser from "./Compiler/Parser.js";

let modes = {
  "paused":"paused",
  "run":"run",
  "debug":"debug"
}

class Editor {
  constructor(computer) {
    let self = this;
    this.computer = computer;
    this.breakpoints = [];
    this.mode = modes.paused;
    this.running = false;
    this.debug = false;
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
      if(!info.gutterMarkers){
        info.handle.on("delete", function(){
          self.breakpoints[n] = false;
        });
      }
      self.breakpoints[info.line] = info.gutterMarkers ? false :  true;
      cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
    });

    this.compileButton = document.getElementById("compile");
    this.debugButton = document.getElementById("debug");
    this.stepButton = document.getElementById("step");
    this.runButton = document.getElementById("run");
    this.compileButton.onclick = function() {
      self.upload();
    };
    this.debugButton.onclick = function() {
      self.debug();
    };
    this.stepButton.onclick = function(){
      self.step();
    };
    this.runButton.onclick = function(){
      self.toggleRun();
    }

    this.computer.addEventListener(this);
    this.lineMap = [];
  }

  upload() {
    let bytesAndBreakpoints = this.compile();
    let bytes = bytesAndBreakpoints[0];
    this.lineMap = bytesAndBreakpoints[2];
    this.mode = modes.run;
    this.computer.reset();
    let condensed = Array.from(bytes);
    let dilute = [];
    for(let i = 0; i<condensed.length/2; i++){
      dilute[i] = condensed[i*2+1];
      dilute[i+256] = condensed[i*2];
    }
    this.computer.setRam(dilute);
    this.debug = false;
    this.highlightLine(-1);
  }

  debug() {
    console.log("debug");
    this.mode = modes.debug;
    this.debug = true;
  }

  compile() {
    let assemblyAndBreakpoints = this.parse();
    let byteCode = assemblyAndBreakpoints[0].getBytes();
    return [byteCode, assemblyAndBreakpoints[1], assemblyAndBreakpoints[2]];
  }

  parse(){
    let code = this.codeMirror.doc.getValue();
    let assemblyAndBreakpoints = Parser(code, this.breakpoints);
    return assemblyAndBreakpoints;
  }

  step(){
    if(!this.debug){
      this.computer.step();
    }
  }

  highlightLine(line){
    let doc = this.codeMirror.getDoc();
    if(this.previousActiveLine !== -1){
      doc.removeLineClass(this.previousActiveLine, "background", "highlight-line");
    }
    doc.addLineClass(line, "background", "highlight-line");
    this.previousActiveLine = line;
  }

  toggleRun(){
    if(this.running){
      this.running = false;
      this.runButton.innerHTML = "▶";
    } else {
      this.running = true;
      this.runButton.innerHTML = "⏸";
    }
  }

  onEvent(eventId, data){
    if(eventId === "next-instruction"){
      let activeLine = this.lineMap[data];
      if(activeLine || activeLine === 0){
        this.highlightLine(activeLine);
      }
    }
  }
}

export default Editor;
