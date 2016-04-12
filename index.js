
const boot = require('loopback-boot');
const agent = require('./lib/agent');

module.exports = load;
function load(pathname, oncomplete) {
  const app = agent();
  boot(app, pathname);
  if (typeof oncomplete === 'function') {
    app.once('booted', oncomplete);
  }
}

