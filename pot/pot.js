var Firebase = require("firebase");
var five = require("johnny-five");

// Create a new reference of Firebase db
var firebaseRef = new Firebase(
  // fictional URL, replace it with your own from Firebase
  "https://blinding-inferno-2589.firebaseio.com/colors"
);

five.Board().on("ready", function() {
  var maxValue = 511;
  var colRange = 6;
  var offset   = maxValue / colRange;

  // Create a new pot instance
  var pot = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  // Create a new led array based on pin number
  var led = new five.Led.RGB([11,9,10]);

  // Listen on data change
  pot.on("data", function() {

    var self = this.value;
    // Print pot value
    //console.log('Self Value: ' + self);

    // Map dynamic color brightness to pot value
    // RED - MAGENTA - BLUE
    var redDec   = Math.round(five.Fn.map(self, offset, offset*2, 255, 0));
    var blueInc  = Math.round(five.Fn.map(self, 0, offset, 0, 255));
    // BLUE - CYAN - GREEN
    var blueDec  = Math.round(five.Fn.map(self, offset*3, offset*4, 255, 0));
    var greenInc = Math.round(five.Fn.map(self, offset*2, offset*3, 0, 255));
    // GREEN - YELLOW - RED
    var greenDec = Math.round(five.Fn.map(self, offset*5, offset*6, 255, 0));
    var redInc   = Math.round(five.Fn.map(self, offset*4, offset*5, 0, 255));

    // Adjusting color brightness conditionally based on
    // the location of the pot output value.
    switch (true) {
      case (self > 0 && self <= offset):
        console.log("1st loop: 255, 0, " + blueInc);
        led.color(255,0,blueInc);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": 255, "b": blueInc, "g": 0});
        break;
      case (self > offset && self <= offset*2):
        console.log("2nd loop: " + redDec + ", 0, 255");
        led.color(redDec,0,255);
        // update firebase colors' child node r, g, b
        firebaseRef.set({"r": redDec, "b": 255, "g": 0});
	break;
      case (self > offset*2 && self <= offset*3):
        console.log("3rd loop: 0, " + greenInc + ", 255");
        led.color(0,greenInc,255);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": 0, "b": 255, "g": greenInc});
	break;
      case (self > offset*3 && self <= offset*4):
        console.log("4th loop: 0, 255, " + blueDec);
        led.color(0,255,blueDec);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": 0, "b": blueDec, "g": 255});
        break;
      case (self > offset*4 && self <= offset*5):
        console.log("5th loop: " + redInc + ", 255, 0");
        led.color(redInc,255,0);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": redInc, "b": 0, "g": 255});
	break;
      case (self > offset*5 && self <= offset*6):
        console.log("6th loop: 255, " + greenDec + ", 0");
        led.color(255,greenDec,0);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": 255, "b": 0, "g": greenDec});
	break;
      default:
        console.log("Out of range: 255, 0, 0");
        led.on();
        led.color(255,0,0);
      	// update firebase colors' child node r, g, b
      	firebaseRef.set({"r": 255, "b": 0, "g": 0});
    }
  });
});
