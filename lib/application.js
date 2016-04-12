'use strict'

/*!
 * Module dependencies.
 */

var DataSource = require('loopback-datasource-juggler').DataSource;
var Registry = require('./registry');
var assert = require('assert');
var fs = require('fs');
var extend = require('util')._extend;
var classify = require('underscore.string/classify');
var camelize = require('underscore.string/camelize');
var path = require('path');
var util = require('util');

/**
 * The `App` object represents a Loopback application.
 *
 * The App object extends [Express](http://expressjs.com/api.html#express) and
 * supports Express middleware. See
 * [Express documentation](http://expressjs.com/) for details.
 *
 * ```js
 * var loopback = require('loopback');
 * var app = loopback();
 *
 * app.get('/', function(req, res){
 *   res.send('hello world');
 * });
 *
 * app.listen(3000);
 * ```
 *
 * @class LoopBackApplication
 * @header var app = loopback()
 */
function App() {
  // this is a dummy placeholder for jsdox
}

/*!
 * Export the app prototype.
 */

var app = module.exports = {};

/*!
 * Remove a route by reference.
 */

app.disuse = function(route) {
  if (this.stack) {
    for (var i = 0; i < this.stack.length; i++) {
      if (this.stack[i].route === route) {
        this.stack.splice(i, 1);
      }
    }
  }
};

/**
 * Attach a model to the app. The `Model` will be available on the
 * `app.models` object.
 *
 * Example - Attach an existing model:
 ```js
 * var User = loopback.User;
 * app.model(User);
 *```
 * Example - Attach an existing model, alter some aspects of the model:
 * ```js
 * var User = loopback.User;
 * app.model(User, { dataSource: 'db' });
 *```
 *
 * @param {Object|String} Model The model to attach.
 * @options {Object} config The model's configuration.
 * @property {String|DataSource} dataSource The `DataSource` to which to attach the model.
 * @property {Boolean} [public] Whether the model should be exposed via REST API.
 * @property {Object} [relations] Relations to add/update.
 * @end
 * @returns {ModelConstructor} the model class
 */

app.model = function(Model, config) {
  var isPublic = true;
  var registry = this.registry;

  if (arguments.length > 1) {
    config = config || {};
    if (typeof Model === 'string') {
      // create & attach the model - backwards compatibility

      // create config for loopback.modelFromConfig
      var modelConfig = extend({}, config);
      modelConfig.options = extend({}, config.options);
      modelConfig.name = Model;

      // modeller does not understand `dataSource` option
      delete modelConfig.dataSource;

      Model = registry.createModel(modelConfig);

      // delete config options already applied
      ['relations', 'base', 'acls', 'hidden', 'methods'].forEach(function(prop) {
        delete config[prop];
        if (config.options) delete config.options[prop];
      });
      delete config.properties;
    }

    configureModel(Model, config, this);
    isPublic = config.public !== false;
  } else {
    assert(Model.prototype instanceof Model.registry.getModel('Model'),
      Model.modelName + ' must be a descendant of loopback.Model');
  }

  var modelName = Model.modelName;
  this.models[modelName] =
    this.models[classify(modelName)] =
      this.models[camelize(modelName)] = Model;

  this.models().push(Model);
  Model.app = this;
  Model.emit('attached', this);
  return Model;
};

/**
 * Get the models exported by the app. Returns only models defined using `app.model()`
 *
 * There are two ways to access models:
 *
 * 1.  Call `app.models()` to get a list of all models.
 *
 * ```js
 * var models = app.models();
 *
 * models.forEach(function(Model) {
 *  console.log(Model.modelName); // color
 * });
 * ```
 *
 * 2. Use `app.model` to access a model by name.
 * `app.models` has properties for all defined models.
 *
 * The following example illustrates accessing the `Product` and `CustomerReceipt` models
 * using the `models` object.
 *
 * ```js
 * var loopback = require('loopback');
 *  var app = loopback();
 *  app.boot({
 *   dataSources: {
 *     db: {connector: 'memory'}
 *   }
 * });
 *
 * app.model('product', {dataSource: 'db'});
 * app.model('customer-receipt', {dataSource: 'db'});
 *
 * // available based on the given name
 * var Product = app.models.Product;
 *
 * // also available as camelCase
 * var product = app.models.product;
 *
 * // multi-word models are avaiable as pascal cased
 * var CustomerReceipt = app.models.CustomerReceipt;
 *
 * // also available as camelCase
 * var customerReceipt = app.models.customerReceipt;
 * ```
 *
 * @returns {Array} Array of model classes.
 */

app.models = function() {
  return this._models || (this._models = []);
};

/**
 * Define a DataSource.
 *
 * @param {String} name The data source name
 * @param {Object} config The data source config
 */
app.dataSource = function(name, config) {
  var ds = dataSourcesFromConfig(name, config, this.connectors, this.registry);
  this.dataSources[name] =
  this.dataSources[classify(name)] =
  this.dataSources[camelize(name)] = ds;
  return ds;
};

/**
 * Register a connector.
 *
 * When a new data-source is being added via `app.dataSource`, the connector
 * name is looked up in the registered connectors first.
 *
 * Connectors are required to be explicitly registered only for applications
 * using browserify, because browserify does not support dynamic require,
 * which is used by LoopBack to automatically load the connector module.
 *
 * @param {String} name Name of the connector, e.g. 'mysql'.
 * @param {Object} connector Connector object as returned
 *   by `require('loopback-connector-{name}')`.
 */
app.connector = function(name, connector) {
  this.connectors[name] =
  this.connectors[classify(name)] =
  this.connectors[camelize(name)] = connector;
};

/*!
 * Get a handler of the specified type from the handler cache.
 * @triggers `mounted` events on shared class constructors (models)
 */

app.handler = function(type, options) {
  var handlers = this._handlers || (this._handlers = {});
  if (handlers[type]) {
    return handlers[type];
  }

  var remotes = this.remotes();
  var handler = this._handlers[type] = remotes.handler(type, options);

  remotes.classes().forEach(function(sharedClass) {
    sharedClass.ctor.emit('mounted', app, sharedClass, remotes);
  });

  return handler;
};

/**
 * An object to store dataSource instances.
 */

app.dataSources = app.datasources = {};

function dataSourcesFromConfig(name, config, connectorRegistry, registry) {
  var connectorPath;

  assert(typeof config === 'object',
    'cannont create data source without config object');

  if (typeof config.connector === 'string') {
    name = config.connector;
    if (connectorRegistry[name]) {
      config.connector = connectorRegistry[name];
    } else {
      connectorPath = path.join(__dirname, 'connectors', name + '.js');

      if (fs.existsSync(connectorPath)) {
        config.connector = require(connectorPath);
      }
    }
  }

  return registry.createDataSource(config);
}

function configureModel(ModelCtor, config, app) {
  assert(ModelCtor.prototype instanceof ModelCtor.registry.getModel('Model'),
    ModelCtor.modelName + ' must be a descendant of loopback.Model');

  var dataSource = config.dataSource;
  if (dataSource && typeof dataSource === 'string') {
    dataSource = app.dataSources[dataSource];
  }

  config = extend({}, config);
  config.dataSource = dataSource;
  app.registry.configureModel(ModelCtor, config);
}
