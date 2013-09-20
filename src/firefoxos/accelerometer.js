var firefoxos = require('cordova/platform');

// initiate watching the acceleration and clear it straight afterwards
function getCurrentAcceleration(accelerometerSuccess, accelerometerError) {
    var listener = document.addEventListener('devicemotion', accelerationCallback, false);
    function accelerationCallback(deviceMotionEvent) {
        accelerometerSuccess(deviceMotionEvent.acceleration);
        document.removeEventListener('devicemotion', listener, false);
    }
}

// listen to acceleration and call accelerometerSuccess every x milliseconds
function watchAcceleration(accelerometerSuccess, accelerometerError, options) {
    // last timestamp when callback was called
    var hit = 0;
    var frequency = 0;
    if (options && options.frequency) {
        frequency = options.frequency;
    }
    function accelerationCallback(deviceMotionEvent) {
        var newHit;
        if (frequency) {
          newHit = new Date().getTime();
        }
        if (!frequency || newHit >= hit + frequency) {
            // return acceleration object instead of event
            accelerometerSuccess(deviceMotionEvent.acceleration);
            hit = newHit;
        }
    }
    return document.removeEventListener('devicemotion', accelerationCallback, false);
}

function clearWatch(watchId) {
    document.removeEventListener('devicemotion', watchId);
}

var Accelerometer = {
    getCurrentAcceleration: getCurrentAcceleration,
    watchAcceleration: watchAcceleration,
    clearWatch: clearWatch,
};

firefoxos.registerPlugin('Accelerometer', Accelerometer);
