function onButtonClick() {
  
  console.log('Requesting Bluetooth Device...');

  navigator.bluetooth.requestDevice(/*{acceptAllDevices: true}*/ { filters: [{ services: [0xfee8, 0xfee9] }] })
  .then(device => {
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
    console.log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}
