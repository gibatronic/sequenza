var Sequenza = require('../lib/sequenza');

describe('sequenza', function() {
  var hasMethod = function(name) {
    return name in Sequenza.prototype && Sequenza.prototype[name] instanceof Function;
  };

  var isFunction = function(object) {
    return object instanceof Function;
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
});
