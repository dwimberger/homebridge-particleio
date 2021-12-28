**Particle.io device plugin for Homebridge**
-------------------------------------

This plugin for adding Particle.io devices to homebridge is based on the Particle.io SDK for node.
You can install it using NPM like all other modules, using:

`npm install -g homebridge-particleio`.

The plugin is a platform that has to be defined in the `config.json` file. The plugin loads the accessories from the `config.json` file and creates the accessories dynamically. A sample configuration file is like:

```JSON
{
  "bridge": {
    "name": "Test Homebridge",
    "username": "CC:22:3D:E3:CE:39",
    "port": 51826,
    "pin": "042-45-975"
  },
  "description": "This is an example configuration file with a Particle.io platform. It refers to a single Particle device and
  configures 2 accessories, a switch and a temperature sensor. Configure as you please.",
  "platforms": [
    {
      "platform": "ParticleIO",
      "name": "Particle Devices",
      "accessToken": "<<accessToken>>",
      "particles": [
        {
          "deviceId": "<<deviceId>>",
          "events": [
            {
              "name": "TEMPERATURES",
              "separator": ":",
              "contained": "TEMP1:TEMP2:TEMP3:TEMP4:TEMP5:TEMP6:TEMP7:TEMPIN",
              "variables": true
            },
            {
              "name": "VALVES",
              "separator": ":",
              "contained": "Valve1:Valve2:Valve3:Valve4:Valve5:Valve6"
            }
          ]
        }
      ],
      "devices": [
        {
          "name": "Bathroom Heating",
          "type": "switch",
          "deviceId": "<<deviceId>>",
          "get": {
            "type": "variable",
            "name": "VALVE6"
          },
          "set": {
            "type": "function",
            "name": "relayOnOff",
            "args": "{STATE}:6"
          }
        },
        {
          "name": "Bathroom Outflow",
          "type": "temperaturesensor",
          "deviceId": "<<deviceId>>",
          "get": {
            "type": "variable",
            "name": "TEMP6"
          }
        }
      ]
    }
  ]
}
```

 The **accessToken** defines the Particle [Access Token](https://docs.particle.io/tutorials/device-cloud/authentication/#access-tokens). The easiest way to create this token can be found [here](https://docs.particle.io/reference/developer-tools/cli/#particle-token-create). I would recommend to issue a token that does not expire, or set a reminder to rotate it :)

```
$ particle token create --never-expires
```

The  `particles` array of the platform descriptor contains the particle devices. It should hold  the `deviceId` and an `events` array 
that will be used for subscription. You can use

 - **name** - The name of the event issued by the device.
 - **separator** - If the event contains more values (e.g. 8 temperature sensors) then this separator will be used to split them.
 - **contained** - Describes the variables of the values that are contained in the event; should use the `separator`

The idea of this is to optimize the amount handling in cases were you transport a lot of state with few events (there are limitations for free use ;).

The `devices` array contains all the accessories. You can see the accessory object defines following string objects:

 - **name** - Display name, this is the name to be displayed on the HomeKit app.
 - **type** - Type of the accessory. As of now, the plugin supports 3 types: `switch`, `temperaturesensor` and `humiditysensor`.
 - **deviceId** - Device ID of the Particle Device (Core, Photon or Electron). It will always be obtained from the `particles` array.
 - **get** - holds further configuration for getters.
 - **set** - holds further configuration for setters.

The `get`:

 - **type** - The type of getter; either `event` or `variable`
 - **name** - This is the name of the event or variable

 The `set`:

 - **type** - The type of getter; currently only `function`
 - **name** - This is the name of the function to be called
 - **args** - The arguments for the function call. `{STATE}` will be replaced by `on` or `off`.  This should be handled as command by 
 the firmware.


