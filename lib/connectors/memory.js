/**
 * Expose `Memory`.
 */

module.exports = Memory;

/**
 * Module dependencies.
 */

const Connector = require('./base-connector');
const debug = require('debug')('memory');
const util = require('util');
const inherits = util.inherits;
const assert = require('assert');
const JdbMemory = require('loopback-datasource-juggler/lib/connectors/memory');

/**
 * Create a new `Memory` connector with the given `options`.
 *
 * @param {Object} options
 * @return {Memory}
 */

function Memory() {
  // TODO implement entire memory connector
}

/**
 * Inherit from `DBConnector`.
 */

inherits(Memory, Connector);

/**
 * JugglingDB Compatibility
 */

Memory.initialize = JdbMemory.initialize;
