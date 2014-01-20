(function(win) {
    var cordova = require('cordova'),
        Acceleration = require('org.apache.cordova.device-motion.Acceleration'),
        accelerometerCallback = null;

    module.exports = {
        start: function (successCallback, errorCallback) {
            if (accelerometerCallback) {
                win.removeEventListener("devicemotion", accelerometerCallback, true);
            }

            accelerometerCallback = function (motion) {
                successCallback({
                    x: motion.accelerationIncludingGravity.x,
                    y: motion.accelerationIncludingGravity.y,
                    z: motion.accelerationIncludingGravity.z,
                    timestamp: new Date().getTime()
                });
            };
            win.addEventListener("devicemotion", accelerometerCallback, true);
        },

        stop: function (successCallback, errorCallback) {
            win.removeEventListener("devicemotion", accelerometerCallback, true);
            accelerometerCallback = null;
        }
    };

    require("cordova/tizen/commandProxy").add("Accelerometer", module.exports);
}(window));
