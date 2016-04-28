'use strict';
const agent = require('../index.js');
const path = require('path');

describe('index.js', function() {
  let app;
  it('should boot', function(next) {
    app = agent(path.join(__dirname, './server1'));
    next();
  });
  it('should boot with callback', function(next) {
    app = agent(path.join(__dirname, './server1'), next);
  });
});
