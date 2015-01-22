var tessel = require("tessel");
var wifi = require('wifi-cc3000');

var accel = require('accel-mma84').use(tessel.port['D']);
var http = require('http');
var isConnected = false;
var pedalCount = 0;

var wifiSettings = {
  ssid: "django",
  password: 'nishil1234',
  timeout: 40,
  security: 'wpa2'
};

checkConnection();

wifi.on('disconnect', function () {
  console.log('Disconnected.');
  checkConnection();
});

var led1 = tessel.led[0].output(1);

function checkConnection () {
  if (wifi.isConnected()) {
    console.log('Connected.');
    isConnected = true;
    main();
  } else {
    console.log('Connecting...');
    wifi.connect(wifiSettings, function (err, res) {
      if(err) {
        console.log('Error connecting:', err);
      }
      console.log(res);
      checkConnection();
    });
  }
}


function sendPedals() {

  if (isConnected == false){
    console.log("WiFi not connected");
    return;
  } 

  if (pedalCount > 0) {
    console.log("Sending Pedals ",pedalCount)
    console.log("http://secret-refuge-5098.herokuapp.com/increment_pedals/"+pedalCount)
    http.get("http://secret-refuge-5098.herokuapp.com/increment_pedals/"+pedalCount, function (res) {
      console.log('Sent Pedal', res.statusCode)
    }).on('error', function (e) {
      console.log('not ok -', e.message, 'error event')
    });
    pedalCount = 0;
  }
}

setInterval(sendPedals,5000)

function incrementPedals() {
  pedalCount++;
}

// RFID module is ready here! if on is 'ready' then run the function(version)
/*  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    console.log('Getting RFID data')
    card_string = card.uid.toString('hex');
    console.log('UID:', card_string);
    pubnub.publish({
         channel : "tessel_rfid",
         message : card,
         callback: function(m){ console.log(m) }
    });

  });
});

rfid.on('error', function (err) {
  console.error(err);
});*/


function main() {

  console.log("Starting Loop");
  
}


 //Initialize the accelerometer.

var z = {min:0,max:0,val:0};

accel.on('ready', function () {

    //accel.setOutputRate(0.56, function rateSet() {
      accel.on('data', function (xyz) {

        z.val = xyz[2];

        if (z.val > z.max){
          z.max = z.val;
        }
        if (z.val < z.min) {
          z.min = z.val;
        }

       if (z.max - z.min > 1.7) {
          z = {min:0,max:0,val:0};
          console.log("Sending Pedal");
          incrementPedals();
        }
      });
   // });



});

accel.on('error', function(err){
  console.log('Accelrometer DataError:', err);
});