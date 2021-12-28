const EventEmitter = require('events');
const HashMap = require('hashmap');

class ParticleDevice extends EventEmitter {

    constructor(log, particle, accessToken, particleConfig) {
        super();
        this.log = log;
        this.particle = particle;
        this.deviceId = particleConfig.deviceId;
        this.accessToken = accessToken;
        this.particleConfig = particleConfig;
        this.state = new HashMap();

        // Prepare state handling
        this._prepareState();
    }

    _prepareState() {
        let that = this;
        if (this.particleConfig.events) {
            for (let pev of this.particleConfig.events) {
                let name = pev.name;
                // 1. Prepare the local state 
                let eventValues = new HashMap();
                this.state.set(name, eventValues);

                // 2. handle separator
                let separator = pev.separator;
                eventValues.set('mySeparator', separator);

                // 3. prepare variables
                let eventVariables = pev.contained.split(separator);
                eventValues.set('myVariables', eventVariables);
            }
            // Subscribe the device
            this._subscribe(this.deviceId);
        }
    }

    _eventHandler(eventData) {
        let eventState = this.state.get(eventData.name);
        if (eventState) {
            let values = eventData.data.split(eventState.get('mySeparator'));
            let variables = eventState.get('myVariables');
            for (let i = 0; i < variables.length; i++) {
                // Store state
                eventState.set(variables[i], values[i]);
                // Emit new state
                this.emit(variables[i], values[i]);
            }
        }
    }

    _subscribe(deviceId) {
        this.particle.getEventStream({
            deviceId: deviceId,
            auth: this.accessToken
        }).then(function (stream) {
            stream.on('event', this._eventHandler.bind(this));
        }.bind(this));
    }

    getVariableState(name, callback) {
        let that = this;
        this.particle.getVariable({
            deviceId: this.deviceId,
            name: name,
            auth: this.accessToken
        }).then(function (data) {
            try {
                callback(null, data.body.result);
            } catch (err) {
                that.log(`Caught error ${err} when calling homebridge callback.`);
            }
        }, function (err) {
            that.log(`An error occurred while getting variable ${err}`);
        });
    }

    callFunction(name, fargs, callback) {
        let that = this;
        this.particle.callFunction({
            deviceId: this.deviceId,
            name: name,
            auth: this.accessToken,
            argument: fargs
        }).then(
            function (data) {
                try {
                    callback(null, data.return_value);
                } catch (err) {
                    that.log(`Caught error ${err} when calling homebridge callback.`);
                }
            }, function (err) {
                that.log(`An error occurred while calling function ${err}`);
            });
    }

}
module.exports = ParticleDevice;