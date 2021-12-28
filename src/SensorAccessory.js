const Accessory = require('./Accessory.js');

class SensorAccessory extends Accessory {
  constructor(log, particle, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, particle, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.eventName = device.eventName;
    this.key = device.key;
    this.unit = null;
    this.separator = !device.separator ? '=' : device.separator;

    this.getType = device.get.type;
    this.getName = device.get.name;
    this.value = 0;
    
    const sensorService = new ServiceType(this.name);
    this.characteristic = sensorService
      .getCharacteristic(CharacteristicType);
    this._prepareGet();
    this.services.push(sensorService);
  }


  _prepareGet() {
    switch (this.getType) {
      case 'event':
        this.particle.on(this.getName, (val) => {
          this.value = val;
        });
        this.characteristic.on('get', this.getEventState.bind(this));
        break;
      case 'variable':
      default:
        this.characteristic.on('get', this.getVariableState.bind(this));
        break;
    }

  }

  getEventState(callback) {
    callback(null, this.value);
  }

  getVariableState(callback) {
    this.particle.getVariableState(this.getName, callback);
  }

  getState(callback) {
    switch (this.type) {
      case 'event':
        this.getEventState(callback);
        break;
      case 'variable':
      default:
        this.getVariableState(callback);
        break;
    }
  }

  setCurrentValue(value) {
    this.value = value;
  }

}

module.exports = SensorAccessory;
