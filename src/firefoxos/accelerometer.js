var listener;
var Accelerometer = {
    start: function start(success, error) {
        listener = function(ev) {
            var acc = ev.accelerationIncludingGravity;
            acc.timestamp = new Date().getTime();
            success(acc);
        }
        return window.addEventListener('devicemotion', listener, false);
    },

    stop: function stop() {
        window.removeEventListener('devicemotion', listener, false);
    }
};

module.exports = Accelerometer;
require('cordova/firefoxos/commandProxy').add('Accelerometer', Accelerometer);
