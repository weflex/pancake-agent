'use strict';

/**
 * Expose `Connector`.
 */

module.exports = Connector;

/**
 * Module dependencies.
 */

const EventEmitter = require('events').EventEmitter;
const debug = require('debug')('connector');
const util = require('util');
const inherits = util.inherits;
const assert = require('assert');

/**
 * Create a new `Connector` with the given `options`.
 *
 * @param {Object} options
 * @return {Connector}
 */

function Connector(options) {
  EventEmitter.apply(this, arguments);
  this.options = options;

  debug('created with options', options);
}

/**
 * Inherit from `EventEmitter`.
 */

inherits(Connector, EventEmitter);

/*!
 * Create an connector instance from a JugglingDB adapter.
 */

Connector._createJDBAdapter = function(jdbModule) {
  var fauxSchema = {};
  jdbModule.initialize(fauxSchema, function() {
    // connected
  });
};

/*!
 * Add default crud operations from a JugglingDB adapter.
 */

Connector.prototype._addCrudOperationsFromJDBAdapter = function(connector) {

};
