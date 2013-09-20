var firefoxos = require('cordova/platform');


var Accelerometer = {
    start: function start(accelerometerSuccess, accelerometerError) {
        console.log('start watching acecelerometer');
        function accelerationCallback(deviceMotionEvent) {
            accelerometerSuccess(deviceMotionEvent.acceleration);
        }
        return document.addEventListener('devicemotion', accelerationCallback, false);
    },
    stop: function stop(watchId) {
        console.log('stop watching acecelerometer');
        document.removeEventListener('devicemotion', watchId);
    }
};

firefoxos.registerPlugin('Accelerometer', Accelerometer);
