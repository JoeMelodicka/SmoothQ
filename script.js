function onButtonClick() {
  
  console.log('Requesting Bluetooth Device...');

  navigator.bluetooth.requestDevice(/*{acceptAllDevices: true}*/ { filters: [{ services: [0xfee8, 0xfee9] }] } ) // Services of the Smooth Q
  .then(device => {
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
    //console.log('> Connected:        ' + device.gatt.connected);
    return device.gatt.connect();
  })
  .then(server => {
    // Getting Battery Service...
    return server.getPrimaryService(0xfee9);
  })
  .then(service => {
    // Getting Battery Level Characteristic...
    
    return service.getCharacteristic('d44bc439-abfd-45a2-b575-925416129610');
  })
  .then(characteristic => {
    console.log(characteristic);
    return characteristic.readValue();
  })
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}
