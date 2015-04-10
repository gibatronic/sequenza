var rewire = require('rewire');
var Sequenza = rewire('../lib/sequenza');

describe('sequenza', function() {
  var hasMethod = function(name) {
    var sequenza = new Sequenza();

    return isFunction(sequenza[name]);
  };

  var isFunction = function(object) {
    return object instanceof Function;
  };

  var step = {
    callback: function() { },
    delay: 1000
  };

  it('should be a function', function() {
    expect(isFunction(Sequenza)).toBeTruthy();
  });

  it('should have the "queue" method', function() {
    expect(hasMethod('queue')).toBeTruthy();
  });

  it('should have the "start" method', function() {
    expect(hasMethod('start')).toBeTruthy();
  });

  it('should throw an error when trying to queue an invalid step', function() {
    var sequenza = function() {
      return new Sequenza('foo');
    };

    expect(sequenza).toThrow();
  });

  it('should give an empty callback to the step as default', function() {
    var sequenza = new Sequenza({
      delay: 1000
    });

    expect(isFunction(sequenza.steps[0].callback)).toBeTruthy();
  });

  it('should give no delay to the step as default', function() {
    var sequenza = new Sequenza({
      callback: function() { }
    });

    expect(sequenza.steps[0].delay).toBe(0);
  });

  it('should queue the given step through the queue method', function() {
    var sequenza = new Sequenza();

    sequenza.queue(step);

    expect(sequenza.steps[0]).toBe(step);
  });

  it('should queue the given step through the constructor', function() {
    var sequenza = new Sequenza(step);

    expect(sequenza.steps[0]).toBe(step);
  });

  it('should queue the given step through the constructor', function() {
    var sequenza = new Sequenza(step);

    expect(sequenza.steps[0]).toBe(step);
  });

  it('should not start without any steps', function() {
    var sequenza = new Sequenza();
    var schedule = sequenza.schedule;

    sequenza.start();

    expect(sequenza.schedule).toBe(schedule);
  });

  it('should start using requestAnimationFrame when available', function() {
    var requestAnimationFrame = jasmine.createSpy('requestAnimationFrame');
    var setInterval = jasmine.createSpy('setInterval');

    Sequenza.__with__({
      requestAnimationFrame: requestAnimationFrame
    })(function() {
      new Sequenza(step).start();

      expect(requestAnimationFrame).toHaveBeenCalled();
      expect(setInterval).not.toHaveBeenCalled();
    });
  });

  it('should start using setInterval when requestAnimationFrame is not available', function() {
    var setInterval = jasmine.createSpy('setInterval');

    Sequenza.__with__({
      requestAnimationFrame: undefined,
      setInterval: setInterval
    })(function() {
      new Sequenza(step).start();

      expect(setInterval).toHaveBeenCalled();
    });
  });

  it('should trigger the callbacks respecting their delays', function() {
    var callback = jasmine.createSpy('callback');
    var requestAnimationFrameCallback;
    var time = 0;

    var now = function() {
      return time;
    };

    var requestAnimationFrame = function(callback) {
      time += 1000;
      requestAnimationFrameCallback = callback;
    };

    Sequenza.__with__({
      Date: {
        now: now
      },
      requestAnimationFrame: requestAnimationFrame
    })(function() {
      new Sequenza({
        callback: callback,
        delay: 1000
      }, {
        callback: callback,
        delay: 1000
      }, {
        callback: callback,
        delay: 1000
      }).start();

      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(1);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(2);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(3);
    });
  });

  it('should repeat the number of times specified by the iteration option', function() {
    var callback = jasmine.createSpy('callback');
    var requestAnimationFrameCallback;
    var time = 0;

    var now = function() {
      return time;
    };

    var requestAnimationFrame = function(callback) {
      time += 1000;
      requestAnimationFrameCallback = callback;
    };

    Sequenza.__with__({
      Date: {
        now: now
      },
      requestAnimationFrame: requestAnimationFrame
    })(function() {
      new Sequenza({
        callback: callback,
        delay: 1000
      }, {
        callback: callback,
        delay: 1000
      }, {
        callback: callback,
        delay: 1000
      }).start({
        iterations: 2
      });

      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(1);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(2);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(3);
      requestAnimationFrameCallback();
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(4);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(5);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(6);
      requestAnimationFrameCallback();
      expect(callback.calls.count()).toBe(6);
    });
  });

  it('should allow method chaining', function() {
    var requestAnimationFrame = jasmine.createSpy('requestAnimationFrame');

    Sequenza.__with__({
      requestAnimationFrame: requestAnimationFrame
    })(function() {
      var sequenza = new Sequenza();

      expect(sequenza.queue(step)).toBe(sequenza);
      expect(sequenza.start()).toBe(sequenza);
    });
  });
});
