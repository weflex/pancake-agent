'use strict';

/*!
 * Module Dependencies.
 */
var assert = require('assert');
var extend = require('util')._extend;

module.exports = function(registry) {

  var Model = registry.modelBuilder.define('Model');
  Model.registry = registry;
  Model.ValidationError = require('loopback-datasource-juggler').ValidationError;

  /**
   * The `loopback.Model.extend()` method calls this when you create a model that extends another model.
   * Add any setup or configuration code you want executed when the model is created.
   * See  [Setting up a custom model](http://docs.strongloop.com/display/LB/Extending+built-in+models#Extendingbuilt-inmodels-Settingupacustommodel).
   */

  Model.setup = function() {
    var ModelCtor = this;
    var Parent = this.super_;

    if (!ModelCtor.registry && Parent && Parent.registry) {
      ModelCtor.registry = Parent.registry;
    }

    var options = this.settings;
    var typeName = this.modelName;
    ModelCtor._runWhenAttachedToApp = function(fn) {
      if (this.app) return fn(this.app);
      var self = this;
      self.once('attached', function() {
        fn(self.app);
      });
    };
    return ModelCtor;
  };

  /**
   * Get the `Application` object to which the Model is attached.
   *
   * @callback {Function} callback Callback function called with `(err, app)` arguments.
   * @param {Error} err Error object; see [Error object](http://docs.strongloop.com/display/LB/Error+object).
   * @param {Application} app Attached application object.
   * @end
   */

  Model.getApp = function(callback) {
    var self = this;
    self._runWhenAttachedToApp(function(app) {
      assert(self.app);
      assert.equal(app, self.app);
      callback(null, app);
    });
  };

  // setup the initial model
  Model.setup();

  return Model;
};
