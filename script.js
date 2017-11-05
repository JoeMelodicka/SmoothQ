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
      break;
    case 2:
      blueCharacteristic.writeValue(hexToArrayBuffer('061003080006db0681270001757e'));
      break;
    case 3:
      blueCharacteristic.writeValue(hexToArrayBuffer('061003080006db0681270002451d'));
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

async function onTestButtonClick() {
  console.log("trololo");
  /*
  blueCharacteristic.writeValue(hexToArrayBuffer('0610030e957f61061001080068bb'))
  blueCharacteristic.writeValue(hexToArrayBuffer('061002080031eb0610030e957f61'))
  blueCharacteristic.writeValue(hexToArrayBuffer('061001080068bb061002080031eb'))*/

  try {
    log('asdasdas');
    await blueCharacteristic.writeValue(hexToArrayBuffer('0610030e957f61061001080068bb'))

    log('asd: ');
  } catch(error) {
    log('Argh! ' + error);
  }

  /*let asd = 0;
   repeating(asd);*/
}