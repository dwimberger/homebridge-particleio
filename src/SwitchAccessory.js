const ActorAccessory = require('./ActorAccessory.js');

class SwitchAccessory extends ActorAccessory {

  constructor(log, particle, accessToken, device, homebridge) {
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    super(log, particle, accessToken, device, homebridge, Service.Switch, Characteristic.On);
  }

  setState(value, callback) {
    super.setState(value ? 'on' : 'off', callback);
  }
}

module.exports = SwitchAccessory;
