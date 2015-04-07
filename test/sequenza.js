var Sequenza = require('../lib/sequenza');

describe('sequenza', function() {
  it('should be a function', function() {
    var isFunction = Sequenza instanceof Function;
    expect(isFunction).toBe(true);
  });
});
