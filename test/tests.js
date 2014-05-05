exports.defineAutoTests = function() {
  describe('Accelerometer (navigator.accelerometer)', function () {
    var fail = function(done) {
      expect(true).toBe(false);
      done();
    };

    it("accelerometer.spec.1 should exist", function () {
      expect(navigator.accelerometer).toBeDefined();
    });

    describe("getCurrentAcceleration", function() {
      it("accelerometer.spec.2 should exist", function() {
        expect(typeof navigator.accelerometer.getCurrentAcceleration).toBeDefined();
        expect(typeof navigator.accelerometer.getCurrentAcceleration == 'function').toBe(true);
      });

      it("accelerometer.spec.3 success callback should be called with an Acceleration object", function(done) {
        var win = function(a) {
          expect(a).toBeDefined();
          expect(a.x).toBeDefined();
          expect(typeof a.x == 'number').toBe(true);
          expect(a.y).toBeDefined();
          expect(typeof a.y == 'number').toBe(true);
          expect(a.z).toBeDefined();
          expect(typeof a.z == 'number').toBe(true);
          expect(a.timestamp).toBeDefined();
          expect(typeof a.timestamp).toBe('number');
          done();
        };

        navigator.accelerometer.getCurrentAcceleration(win, fail.bind(null, done));
      });

      it("accelerometer.spec.4 success callback Acceleration object should have (reasonable) values for x, y and z expressed in m/s^2", function(done) {
        var reasonableThreshold = 15;
        var win = function(a) {
          expect(a.x).toBeLessThan(reasonableThreshold);
          expect(a.x).toBeGreaterThan(reasonableThreshold * -1);
          expect(a.y).toBeLessThan(reasonableThreshold);
          expect(a.y).toBeGreaterThan(reasonableThreshold * -1);
          expect(a.z).toBeLessThan(reasonableThreshold);
          expect(a.z).toBeGreaterThan(reasonableThreshold * -1);
          done()
        };

        navigator.accelerometer.getCurrentAcceleration(win, fail.bind(null,done));
      });

      it("accelerometer.spec.5 success callback Acceleration object should return a recent timestamp", function(done) {
        var veryRecently = (new Date()).getTime();
        // Need to check that dates returned are not vastly greater than a recent time stamp.
        // In case the timestamps returned are ridiculously high
        var reasonableTimeLimit = veryRecently + 5000; // 5 seconds from now
        var win = function(a) {
          expect(a.timestamp).toBeGreaterThan(veryRecently);
          expect(a.timestamp).toBeLessThan(reasonableTimeLimit);
          done();
        };

        navigator.accelerometer.getCurrentAcceleration(win, fail.bind(null,done));
      });
    });

    describe("watchAcceleration", function() {
      var id;

      afterEach(function() {
          navigator.accelerometer.clearWatch(id);
      });

      it("accelerometer.spec.6 should exist", function() {
          expect(navigator.accelerometer.watchAcceleration).toBeDefined();
          expect(typeof navigator.accelerometer.watchAcceleration == 'function').toBe(true);
      });

      it("accelerometer.spec.7 success callback should be called with an Acceleration object", function(done) {
        var win = function(a) {
          expect(a).toBeDefined();
          expect(a.x).toBeDefined();
          expect(typeof a.x == 'number').toBe(true);
          expect(a.y).toBeDefined();
          expect(typeof a.y == 'number').toBe(true);
          expect(a.z).toBeDefined();
          expect(typeof a.z == 'number').toBe(true);
          expect(a.timestamp).toBeDefined();
          expect(typeof a.timestamp).toBe('number');
          done();
        };

        id = navigator.accelerometer.watchAcceleration(win, fail.bind(null,done), {frequency:100});
      });

        it("accelerometer.spec.8 success callback Acceleration object should have (reasonable) values for x, y and z expressed in m/s^2", function(done) {
          var reasonableThreshold = 15;
          var win = function(a) {
            expect(a.x).toBeLessThan(reasonableThreshold);
            expect(a.x).toBeGreaterThan(reasonableThreshold * -1);
            expect(a.y).toBeLessThan(reasonableThreshold);
            expect(a.y).toBeGreaterThan(reasonableThreshold * -1);
            expect(a.z).toBeLessThan(reasonableThreshold);
            expect(a.z).toBeGreaterThan(reasonableThreshold * -1);
            done();
          };

          id = navigator.accelerometer.watchAcceleration(win, fail.bind(null,done), {frequency:100});
        });

        it("accelerometer.spec.9 success callback Acceleration object should return a recent timestamp", function(done) {
          var veryRecently = (new Date()).getTime();
          // Need to check that dates returned are not vastly greater than a recent time stamp.
          // In case the timestamps returned are ridiculously high
          var reasonableTimeLimit = veryRecently + 5000; // 5 seconds from now
          var win = function(a) {
            expect(a.timestamp).toBeGreaterThan(veryRecently);
            expect(a.timestamp).toBeLessThan(reasonableTimeLimit);
            done();
          };

          id = navigator.accelerometer.watchAcceleration(win, fail.bind(null,done), {frequency:100});
        });
    });

    describe("clearWatch", function() {
      it("accelerometer.spec.10 should exist", function() {
          expect(navigator.accelerometer.clearWatch).toBeDefined();
          expect(typeof navigator.accelerometer.clearWatch == 'function').toBe(true);
      });

      it("accelerometer.spec.11 should clear an existing watch", function(done) {
          var id;

          // expect win to get called exactly once
          var win = function(a) {
            // clear watch on first call
            navigator.accelerometer.clearWatch(id);
            // if win isn't called again in 201 ms we assume success
            var tid = setTimeout(function() {
              expect(true).toBe(true);
              done();
            }, 101);
            // if win is called again, clear the timeout and fail the test
            win = function() {
              clearTimeout(tid);
              fail(done);
            }
          };

          // wrap the success call in a closure since the value of win changes between calls
          id = navigator.accelerometer.watchAcceleration(function() { win(); }, fail.bind(null, done), {frequency:100});
      });
    });
  });
};
