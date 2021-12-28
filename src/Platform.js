const AccessoryFactory = require('./AccessoryFactory.js');
const ParticleBridge = require('./ParticleBridge.js');

class ParticlePlatform {

  constructor(log, config) {
    this.log = log;
    this.accessToken = config.accessToken;
    this.devices = config.devices;
    this.particleBridge = new ParticleBridge(log, this.accessToken, config.particles);
    this.accessoryFactory = new AccessoryFactory(log, this.particleBridge, this.accessToken, this.devices, global.homebridge);
  }

  accessories(callback) {
    const foundAccessories = this.accessoryFactory.getAccessories();
    callback(foundAccessories);
  }
}

module.exports = ParticlePlatform;
