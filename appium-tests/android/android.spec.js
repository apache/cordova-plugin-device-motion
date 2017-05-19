'use strict';

var wdHelper = require('../helpers/wdHelper');
var wd       = wdHelper.getWD();
var et       = global.ET || require('expect-telnet');
var isDevice = false;

describe('Accelerometer tests Android.', function () {
    var driver;

    var win = function () {
        expect(true).toBe(true);
    };

    var fail = function (error) {
        if (error && error.message) {
            console.log('An error occured: ' + error.message);
            expect(true).toFailWithMessage(error.message);
            return;
        } else if (error) {
            console.log('Failed expectation: ' + error);
            expect(true).toFailWithMessage(error);
            return;
        }
        // no message provided :(
        console.log('An error without description occured');
        expect(true).toBe(false);
    };

    function enterTest() {
        return driver
            .context('WEBVIEW')
            .execute('if (document.querySelector("body").classList.contains("expanded-log")) document.getElementById("log--title").click()')
            .elementByXPath('//a[text()="cordova-plugin-device-motion-tests.tests"]')
            .click()
            .then(win, fail)
            .sleep(5000);
    }

    function mockAccelerometer(x, y, z) {
        var xValue = x || '0';
        var yValue = y || '0';
        var zValue = z || '0';
        return et("127.0.0.1:5554", [
                {expect: "OK"       , send: "sensor set acceleration " + xValue + ":" + yValue + ":" + zValue + "\r\n" },
                {expect: "OK"       , send: "exit\r\n"}
            ], function(err) {
                fail("Couldn't establish a telnet connection to the emulator: " + err);
            });
    }

    function checkValues(x, y, z) {
        var xValue = x.toString();
        var yValue = y.toString();
        var zValue = z.toString();
        return driver.elementById('x')
            .getAttribute('innerHTML')
            .then(function(text){
                expect(text).toBe(xValue);
            }, function (err) {
                fail('Error getting attribute: ' + err);
            })
            .elementById('y')
            .getAttribute('innerHTML')
            .then(function(text){
                expect(text).toBe(yValue);
            }, function (err) {
                fail('Error getting attribute: ' + err);
            })
            .elementById('z')
            .getAttribute('innerHTML')
            .then(function(text){
                expect(text).toBe(zValue);
            }, function (err) {
                fail('Error getting attribute: ' + err);
            });
    }

    beforeEach(function() {
        this.addMatchers({
            toFailWithMessage : function (failmessage) {
                this.message = function() { return failmessage };
                return false;
            }
        });
    });

    it('accelerometer.ui.util.1 configuring driver and starting a session', function (done) {
        driver = wdHelper.getDriver('Android', done);
    }, 240000);

    it('accelerometer.ui.util.2 determine if running on an emulator', function (done) {
        driver
            .sleep(20000)
            .context('WEBVIEW')
            .elementById('model')
            .getAttribute('innerHTML')
            .then(function(model) {
                isDevice = !(model.indexOf('sdk') > -1);
                console.log('isDevice = ' + isDevice);
            })
            .finally(done);
    }, 80000);

    it('accelerometer.ui.util.3 go to manual tests section', function (done) {
        driver
            .context('WEBVIEW')
            .elementByXPath('//a[text()=\'Plugin Tests (Automatic and Manual)\']')
            .click()
            .then(win, function(){
                fail('Couldn\'t find "Plugin Tests (Automatic and Manual)" link.');
            })
            .sleep(15000)
            .elementByXPath('//a[text()=\'Manual Tests\']')
            .click()
            .then(win, function(){
                fail('Couldn\'t find "Manual Tests" link.');
            })
            .finally(done);
    }, 80000);

    describe('Specs (emulator)', function () {
        afterEach(function(done) {
            driver
                .context('WEBVIEW')
                .elementByXPath('//a[text()="cordova-plugin-device-motion-tests.tests"]')
                .fail(function() {
                    return driver
                        .elementByXPath('//a[text()="Back"]')
                        .click();
                })
                .finally(done);
        }, 120000);

        //Mock accelerometer values
        //Press "Get Acceleration" button
        //Verify that mocked values are shown
        it('accelerometer.ui.spec.1 Get Acceleration', function (done) {
            if (isDevice) {
                done();
                return; //Mocking accelerometer is not supported on a real device
            }
            enterTest()
                .then(function() {
                    return mockAccelerometer(0, 0, 0);
                })
                .context('WEBVIEW')
                .elementByXPath('//a[text()="Get Acceleration"]')
                .click()
                .then(function() {
                    return checkValues(0, 0, 0);
                }, fail)
                .then(function() {
                    return mockAccelerometer(-1, -1, -1);
                })
                .elementById('log--title') //log is getting in the way so we need to hide it
                .click()
                .elementByXPath('//a[text()="Get Acceleration"]')
                .click()
                .then(function() {
                    return checkValues(-1, -1, -1);
                }, fail)
                .elementByXPath('//a[text()="Back"]')
                .then(function (element) {
                    element.click();
                }, function() {
                    return driver;
                })
                .finally(done);
        }, 300000);

        //Mock accelerometer values
        //Press "Watch Acceleration" button
        //Verify that mocked values are shown
        //Press "Clear Watch" button
        it('accelerometer.ui.spec.2 Watch Acceleration', function (done) {
            if (isDevice) {
                done();
                return; //Mocking accelerometer is not supported on a real device
            }
            enterTest()
                .then(function() {
                    return mockAccelerometer(0, 0, 0);
                })
                .context('WEBVIEW')
                .elementByXPath('//a[text()="Start Watch"]')
                .click()
                .sleep(1000)
                .then(function() {
                    return checkValues(0, 0, 0);
                }, fail)
                .then(function() {
                    return mockAccelerometer(-1, -1, -1);
                })
                .sleep(2000)
                .then(function() {
                    return checkValues(-1, -1, -1);
                }, fail)
                .elementById('log--title') //log is getting in the way so we need to hide it
                .click()
                .elementByXPath('//a[text()="Clear Watch"]')
                .click()
                .elementByXPath('//a[text()="Back"]')
                .then(function (element) {
                    element.click();
                }, function() {
                    return driver;
                })
                .finally(done);
        }, 300000);

        //Press "Watch Acceleration" button
        //Press "Clear Watch" button
        //Mock acceleration values
        //Verify that they are not displayed
        it('accelerometer.ui.spec.3 Clear Watch', function (done) {
            if (isDevice) {
                done();
                return; //Mocking accelerometer is not supported on a real device
            }
            enterTest()
                .then(function() {
                    return mockAccelerometer(0, 0, 0);
                })
                .context('WEBVIEW')
                .elementByXPath('//a[text()="Start Watch"]')
                .click()
                .sleep(3000)
                .elementById('log--title') //log is getting in the way so we need to hide it
                .click()
                .elementByXPath('//a[text()="Clear Watch"]')
                .click()
                .then(function() {
                    return mockAccelerometer(-1, -1, -1);
                })
                .sleep(1000)
                .then(function() {
                    return checkValues(0, 0, 0);
                }, fail)
                .elementByXPath('//a[text()="Back"]')
                .then(function (element) {
                    element.click();
                }, function() {
                    return driver;
                })
                .finally(done);
        }, 300000);
    });

    it('accelerometer.ui.util.4 Destroy the session', function (done) {
        driver.quit(done);
    }, 10000);
});
