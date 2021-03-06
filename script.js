var blueCharacteristic;

function hexToArrayBuffer (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected input to be a string')
  }

  if ((hex.length % 2) !== 0) {
    throw new RangeError('Expected string to be an even number of characters')
  }

  var view = new Uint8Array(hex.length / 2)

  for (var i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }

  return view.buffer
}

function onConnectButtonClick() {

  //console.log('Requesting Bluetooth Device...');

  navigator.bluetooth.requestDevice(/*{acceptAllDevices: true}*/ { filters: [{ services: [0xfee8, 0xfee9] }] } ) // Services of the Smooth Q
  .then(device => {
    /*console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);*/
    //console.log('> Connected:        ' + device.gatt.connected);
    return device.gatt.connect();
  })
  .then(server => {
    // Getting Battery Service...
    return server.getPrimaryService(0xfee9);
  })
  .then(service => {
    // Getting Battery Level Characteristic...
    return service.getCharacteristic('d44bc439-abfd-45a2-b575-925416129600');
  })
  .then(characteristic => {
    //console.log(characteristic);
    
    blueCharacteristic = characteristic;

    document.querySelector('#mode1Button').disabled = !blueCharacteristic.properties.write;
    document.querySelector('#mode2Button').disabled = !blueCharacteristic.properties.write;
    document.querySelector('#mode3Button').disabled = !blueCharacteristic.properties.write;

    console.log("connected.");
    // Writing 1 is the signal to reset energy expended.
    //return characteristic.writeValue(hexToArrayBuffer('0681270000655f061001080068bb'));
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onModeButtonClick(mode) {
  switch(mode) {
    case 1:
      blueCharacteristic.writeValue(hexToArrayBuffer('0681270000655f061001080068bb'));
      console.log("Mode 1.");
      break;
    case 2:
      blueCharacteristic.writeValue(hexToArrayBuffer('061003080006db0681270001757e'));
      console.log("Mode 2.");
      break;
    case 3:
      blueCharacteristic.writeValue(hexToArrayBuffer('061003080006db0681270002451d'));
      console.log("Mode 3.");
      break;
    default:
      console.log('You fucked something up...');
  }
}
/*
function repeating (asdasd) {
  blueCharacteristic.writeValue(hexToArrayBuffer('0610030e957f61061001080068bb'));
  if(asdasd > 100) {
    return;
  }
  setTimeout(function(){ 

    repeating(asdasd-1)
  }, 100); 
}*/

async function onMoveButtonClick(moving) {
  let msg = null;
  //console.log("trololo");
  /*
  blueCharacteristic.writeValue(hexToArrayBuffer('0610030e957f61061001080068bb'))
  blueCharacteristic.writeValue(hexToArrayBuffer('061002080031eb0610030e957f61'))
  blueCharacteristic.writeValue(hexToArrayBuffer('061001080068bb061002080031eb'))*/
  

  /*
    VALUES (FAKE):
    061002080031eb0610030e957f61 RIGHT
    061002080031eb0610030176a212 LEFT
    061003080006db0610010176cc72 DOWN
    061003080006db0610010e7d6d27 UP

    VALUES (REAL):
    061001012c37cd DOWN
    0610010ed449e4 UP
    061002012c6e9d LEFT
    0610020ed410b4 RIGHT
  */

  
  try {
    //console.log('asdasdas');
    //await blueCharacteristic.writeValue(hexToArrayBuffer('0610030e957f61061001080068bb'));
    switch(moving) {
      case 'R':
        msg = '0610020ed410b4';
        break;
      case 'L':
        msg = '061002012c6e9d';
        break;
      case 'D':
        msg = '061001012c37cd';
        break;
      case 'U':
        msg = '0610010ed449e4';
        break;
      case 'Test':
        msg = 'trololo';
        break;
    }

    for (let i = 1; i <= 500; i++) {
      //console.log('asd: ');
      await blueCharacteristic.writeValue(hexToArrayBuffer(msg)); //it moves!
    }

    //console.log('asd: ');
  } catch(error) {
    console.log('Argh! ' + error);
  }

  /*let asd = 0;
   repeating(asd);*/
}