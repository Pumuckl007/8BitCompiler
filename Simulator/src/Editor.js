class Editor {
  constructor() {
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
      cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
    });
  }
}

export default Editor;
