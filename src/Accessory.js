class Accessory {

  constructor(log, particle, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    this.log = log;
    this.particle = particle;
    this.accessToken = accessToken;
    this.ServiceType = ServiceType;
    this.CharacteristicType = CharacteristicType;

    this.name = device.name;
    this.args = device.args;
    this.deviceId = device.deviceId;
    this.fakeSerial = this.deviceId.slice(-8).toUpperCase();
    this.type = device.type.toLowerCase();
    this.value = null;

    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Particle')
      .setCharacteristic(Characteristic.Model, 'Photon')
      .setCharacteristic(Characteristic.SerialNumber, this.fakeSerial);

    this.services = [];
    this.services.push(this.informationService);
  }

  getServices() {
    return this.services;
  }

}

module.exports = Accessory;
