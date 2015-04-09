var Sequenza = function() {
  'use strict';

  var check = function() {
    var now = Date.now();
    var step = this.schedule.steps[0];
    var hasStep = step != undefined;

    if (!hasStep) {
      if (!hasRequestAnimationFrame) {
        clearInterval(this.intervalId);
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
    start: undefined,
    steps: undefined
  };

  this.queue = function(step) {
    var isStepValid = type(step) == 'Object';

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

  this.start = function() {
    var hasSteps = this.steps.length != 0;

    if (!hasSteps) {
      return;
    }

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
  define([ ], Sequenza);
} else if (typeof exports == 'object') {
  module.exports = Sequenza;
} else {
  this.Sequenza = Sequenza;
}
