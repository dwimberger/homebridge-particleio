
const Particle = require('particle-api-js');
const ParticleDevice = require('./ParticleDevice.js');
const HashMap = require('hashmap');

class ParticleBridge {

    constructor(log, accessToken, particlesConfig) {
        this.log = log;
        this.accessToken = accessToken;
        this.particle = new Particle();
        this.particlesConfig = particlesConfig;
        this.particles = new HashMap();
        for (let particle of particlesConfig) {
            this.particles.set(particle.deviceId, new ParticleDevice(this.log, this.particle, this.accessToken, particle));
        }
    }

    getParticleDevice(deviceId) {
        return this.particles.get(deviceId);
    }

}

module.exports = ParticleBridge;