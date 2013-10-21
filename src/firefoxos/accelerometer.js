
var Accelerometer = {
    start: function start(success, error) {
        return window.addEventListener('devicemotion', function(ev) {
            var acc = ev.accelerationIncludingGravity;
            acc.timestamp = new Date().getTime();
            success(ev.accelerationIncludingGravity);
        }, false);
    },

    stop: function stop() {
        window.removeEventListener('devicemotion');
    }
};

module.exports = Accelerometer;
require('cordova/firefoxos/commandProxy').add('Accelerometer', Accelerometer);
