'use strict';

const loopback = require('../lib/agent');

describe('test lib/agent.js', function() {
  it('should test properties', function(next) {
    expect(!!loopback.registry).toBe(true);
    expect(loopback.Model).toBe(loopback.registry.getModel('Model'));
    expect(loopback.PersistedModel).toBe(loopback.registry.getModel('PersistedModel'));
    expect(loopback.defaultDataSources).toBe(loopback.registry.defaultDataSources);
    expect(loopback.modelBuilder).toBe(loopback.registry.modelBuilder);
    next();
  });
  it('should find model', function(next) {
    expect(loopback.Model).toBe(loopback.findModel('Model'));
    expect(loopback.PersistedModel).toBe(loopback.findModel('PersistedModel'));
    next();
  });
});
