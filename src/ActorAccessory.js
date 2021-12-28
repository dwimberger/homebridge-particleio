const Accessory = require('./Accessory.js');

class ActorAccessory extends Accessory {

  constructor(log, particle, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, particle, accessToken, device, homebridge, ServiceType, CharacteristicType);

    this.actorService = new ServiceType(this.name);
    this.characteristic = this.actorService.getCharacteristic(CharacteristicType);

    this.getType = device.get.type;
    this.getName = device.get.name;
    this.setName = device.set.name;
    this.setArgs = device.set.args;
    this.value = 0;

    this._prepareGet();
    this.characteristic.on('set', this.setState.bind(this));
    this.services.push(this.actorService);
  }
  /** GETTER */

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


  /** SETTER */

  _replaceState(arg, state) {
    console.log('_replaceState', arg, state);
    return arg.replace('{STATE}', state);
  }

  /* 
   * Interface 
   */
  setState(value, callback) {
    let fargs = this._replaceState(this.setArgs, value);
    this.value = value;
    this.particle.callFunction(this.setName, fargs, callback);
  }

}

module.exports = ActorAccessory;
