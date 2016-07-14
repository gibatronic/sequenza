var Sequenza = function() {
  'use strict';

  var check = function() {
    var now = Date.now();
    var step = this.schedule.steps[0];
    var hasStep = step != undefined;

    if (!hasStep) {
      this.schedule.iterations--;

      if (!hasRequestAnimationFrame) {
        clearInterval(this.intervalId);
      }

      if (this.schedule.iterations > 0) {
        this.start({
          iterations: this.schedule.iterations
        });
      }

      return;
    }

    if (hasRequestAnimationFrame) {
      requestAnimationFrame(check.bind(this));
    }

    if (now < step.timestamp) {
      return;
    }

    step.callback();
    this.schedule.steps.shift();
  };

  var hasRequestAnimationFrame = typeof requestAnimationFrame != 'undefined';
  var noop = function() { };

  var setup = function(step, index) {
    var isFirst = index == 0;
    var timestamp;

    if (isFirst) {
      timestamp = this.schedule.start + step.delay;
    } else {
      timestamp = this.lastTimestamp + step.delay;
    }

    this.lastTimestamp = timestamp;

    return {
      callback: step.callback,
      timestamp: timestamp
    };
  };

  var type = function(object) {
    var signature = Object.prototype.toString.call(object);
    var type = signature.replace(/^\[object ([^\]]+)\]$/, '$1');

    return type;
  };

  this.intervalId = undefined;
  this.lastTimestamp = undefined;
  this.steps = [ ];

  this.schedule = {
    iterations: undefined,
    start: undefined,
    steps: undefined
  };

  this.queue = function(step) {
    var isStepValid = false;

    if (type(step) == 'Function') {
      isStepValid = true;

      step = {
        callback: step
      };
    } else if (type(step) == 'Object') {
      isStepValid = true;
    }

    if (!isStepValid) {
      throw new Error('invalid step given to be queued by Sequenza');
    }

    var isCallbackValid = 'callback' in step && type(step.callback) == 'Function';

    if (!isCallbackValid) {
      step.callback = noop;
    }

    var isDelayValid = 'delay' in step && type(step.delay) == 'Number' && isFinite(step.delay);

    if (!isDelayValid) {
      step.delay = 0;
    }

    this.steps.push(step);

    return this;
  };

  this.start = function(options) {
    var hasSteps = this.steps.length != 0;

    if (!hasSteps) {
      return;
    }

    var areOptionsValid = type(options) == 'Object';

    if (!areOptionsValid) {
      options = { };
    }

    var isIterationsOptionsValid = type(options.iterations) == 'Number' && !isNaN(options.iterations);

    if (!isIterationsOptionsValid) {
      options.iterations = 1;
    }

    this.schedule.iterations = Math.max(1, options.iterations);
    this.schedule.start = Date.now();
    this.schedule.steps = this.steps.map(setup.bind(this));

    if (hasRequestAnimationFrame) {
      requestAnimationFrame(check.bind(this));

      return this;
    }

    this.intervalId = setInterval(check.bind(this), 1000 / 60 >> 0);

    return this;
  };

  var argumentsAsStandaloneArray = arguments.length == 1 && type(arguments[0]) == 'Array';
  var normalizedArguments;

  if (argumentsAsStandaloneArray) {
    normalizedArguments = arguments[0];
  } else {
    normalizedArguments = [ ].slice.call(arguments);
  }

  normalizedArguments.forEach(this.queue.bind(this));
};

if (typeof define == 'function' && define.amd) {
  define(function() {
    return Sequenza;
  });
} else if (typeof exports == 'object') {
  module.exports = Sequenza;
} else {
  this.Sequenza = Sequenza;
}
