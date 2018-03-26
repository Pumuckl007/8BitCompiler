import Computer from "./Computer.js";

window.computer = new Computer();


var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("editor"),
{
    lineNumbers: true,
    mode: "gas"
  });
