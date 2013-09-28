var firefoxos = require('cordova/platform');


var Accelerometer = {
    start: function start(successCallback, errorCallback) {
        console.log('start watching accelerometer');
        function accelerationCallback(deviceMotionEvent) {
            successCallback(deviceMotionEvent.acceleration);
        }
        return document.addEventListener('devicemotion', accelerationCallback, false);
    },
    stop: function stop(watchId) {
        console.log('stop watching acecelerometer');
        document.removeEventListener('devicemotion', watchId);
    }
};

firefoxos.registerPlugin('Accelerometer', Accelerometer);
