'use strict';

const createPromiseCallback = require('../lib/utils').createPromiseCallback;

describe('test lib/utils.js', function() {
  it('should test createPromiseCallback', function(next) {
    var obj = createPromiseCallback();
    expect(obj.promise instanceof Promise).toBe(true);
    next();
  });
});
