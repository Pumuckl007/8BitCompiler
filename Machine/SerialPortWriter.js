// (c) 2018 Max Apodaca
// This code is licensed under MIT license (see LICENSE for details)

var SerialPort = require('serialport');


function writeToSerial(portLocation, data){
  let port = new SerialPort(portLocation, {
    baudRate: 57600
  });

  let tmpString = "";

  // The open event is always emitted
  port.on('open', function() {
    console.log("Serialport Open");
  });

  // Switches the port into "flowing mode"
  port.on('data', function (data) {
    let dataStrings = data.toString().split("\n");
    if(dataStrings.length === 0){
      return;
    }
    tmpString += dataStrings[0];
    for(let i = 1; i<dataStrings.length; i++){
      console.log(tmpString);
      tmpString = dataStrings[i];
    }
  });

  // Read data that is available but keep the stream from entering "flowing mode"
  port.on('readable', function () {
    console.log('RData:', port.read());
  });

  setTimeout(function(){
    port.write([data.length/2-1]);
    port.write(data);
    setTimeout(function(){port.close();}, 2000);
  }, 1000);
}

module.exports = writeToSerial;
