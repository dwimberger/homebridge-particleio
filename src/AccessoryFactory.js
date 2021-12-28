const SwitchAccessory = require('./SwitchAccessory.js');
const HumiditySensorAccessory = require('./HumiditySensorAccessory.js');
const TemperatureSensorAccessory = require('./TemperatureSensorAccessory.js');

const accessoryRegistry = {
  switch: SwitchAccessory,
  temperaturesensor: TemperatureSensorAccessory,
  humiditysensor: HumiditySensorAccessory,
};

class AccessoryFactory {

  constructor(log, particleBridge, accessToken, devices, homebridge) {
    this.log = log;
    this.particleBridge = particleBridge;
    this.accessToken = accessToken;
    this.devices = devices;
    this.homebridge = homebridge;
  }

  getAccessories() {
    const validDevices = this.devices.filter(device => device.type.toLowerCase() in accessoryRegistry);
    return validDevices.map(device => this.createAccessory(device));
  }

  createAccessory(device) {
    this.log('Create Accessory for device:', device);
    return new accessoryRegistry[device.type.toLowerCase()](
      this.log, this.particleBridge.getParticleDevice(device.deviceId), this.accessToken, device, this.homebridge
    );
  }
}

module.exports = AccessoryFactory;
