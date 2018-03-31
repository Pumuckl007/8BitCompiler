import Computer from "./Computer.js";
import Editor from "./Editor.js";
import Visualizer from "./Visualizer.js";

window.computer = new Computer();
window.editor = new Editor(window.computer);
window.visualizer = new Visualizer(window.computer);
