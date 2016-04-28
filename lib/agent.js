'use strict';

const proto = require('./application');
const Registry = require('./registry');
const EventEmitter = require('events').EventEmitter;

const loopback = module.exports = createAgent;

loopback.registry = new Registry();
Object.defineProperties(loopback, {
  Model: {
    get: function() { 
      return this.registry.getModel('Model'); 
    }
  },
  PersistedModel: {
    get: function() { 
      return this.registry.getModel('PersistedModel'); 
    }
  },
  defaultDataSources: {
    get: function() { 
      return this.registry.defaultDataSources; 
    }
  },
  modelBuilder: {
    get: function() { 
      return this.registry.modelBuilder; 
    }
  }
});

/*!
 * Create an loopback application.
 *
 * @return {Function}
 */

function createAgent(options) {
  var app = Object.assign(new EventEmitter(), proto);
  app.loopback = loopback;
  app.datasources = app.dataSources = {};
  app.connectors = {};

  app._settings = {};
  app.get = function(name) {
    return app._settings[name];
  };
  app.set = function(name, value) {
    app._settings[name] = value;
  };

  // Register built-in connectors. It's important to keep this code
  // hand-written, so that all require() calls are static
  // and thus browserify can process them (include connectors in the bundle)
  app.connector('memory', require('./connectors/memory'));
  // app.connector('remote', require('./connectors/remote'));

  if (loopback.localRegistry || options && options.localRegistry === true) {
    // setup the app registry
    var registry = app.registry = new Registry();
    if (options && options.loadBuiltinModels === true) {
      require('./builtin-models')(registry);
    }
  } else {
    app.registry = loopback.registry;
  }
  return app;
}

/**
 * Create a named vanilla JavaScript class constructor with an attached
 * set of properties and options.
 *
 * This function comes with two variants:
 *  * `loopback.createModel(name, properties, options)`
 *  * `loopback.createModel(config)`
 *
 * In the second variant, the parameters `name`, `properties` and `options`
 * are provided in the config object. Any additional config entries are
 * interpreted as `options`, i.e. the following two configs are identical:
 *
 * ```js
 * { name: 'Customer', base: 'User' }
 * { name: 'Customer', options: { base: 'User' } }
 * ```
 *
 * **Example**
 *
 * Create an `Author` model using the three-parameter variant:
 *
 * ```js
 * loopback.createModel(
 *   'Author',
 *   {
 *     firstName: 'string',
 *     lastName: 'string'
 *   },
 *   {
 *     relations: {
 *       books: {
 *         model: 'Book',
 *         type: 'hasAndBelongsToMany'
 *       }
 *     }
 *   }
 * );
 * ```
 *
 * Create the same model using a config object:
 *
 * ```js
 * loopback.createModel({
 *   name: 'Author',
 *   properties: {
 *     firstName: 'string',
 *     lastName: 'string'
 *   },
 *   relations: {
 *     books: {
 *       model: 'Book',
 *       type: 'hasAndBelongsToMany'
 *     }
 *   }
 * });
 * ```
 *
 * @param {String} name Unique name.
 * @param {Object} properties
 * @param {Object} options (optional)
 *
 * @header loopback.createModel
 */

loopback.createModel = function(name, properties, options) {
  return this.registry.createModel.apply(this.registry, arguments);
};

/**
 * Alter an existing Model class.
 * @param {Model} ModelCtor The model constructor to alter.
 * @options {Object} config Additional configuration to apply
 * @property {DataSource} dataSource Attach the model to a dataSource.
 * @property {Object} [relations] Model relations to add/update.
 *
 * @header loopback.configureModel(ModelCtor, config)
 */

loopback.configureModel = function(ModelCtor, config) {
  return this.registry.configureModel.apply(this.registry, arguments);
};

/**
 * Look up a model class by name from all models created by
 * `loopback.createModel()`
 * @param {String} modelName The model name
 * @returns {Model} The model class
 *
 * @header loopback.findModel(modelName)
 */
loopback.findModel = function(modelName) {
  return this.registry.findModel.apply(this.registry, arguments);
};

/**
 * Look up a model class by name from all models created by
 * `loopback.createModel()`. Throw an error when no such model exists.
 *
 * @param {String} modelName The model name
 * @returns {Model} The model class
 *
 * @header loopback.getModel(modelName)
 */
loopback.getModel = function(modelName) {
  return this.registry.getModel.apply(this.registry, arguments);
};

/**
 * Look up a model class by the base model class.
 * The method can be used by LoopBack
 * to find configured models in models.json over the base model.
 * @param {Model} modelType The base model class
 * @returns {Model} The subclass if found or the base class
 *
 * @header loopback.getModelByType(modelType)
 */
loopback.getModelByType = function(modelType) {
  return this.registry.getModelByType.apply(this.registry, arguments);
};

/**
 * Create a data source with passing the provided options to the connector.
 *
 * @param {String} name Optional name.
 * @options {Object} options Data Source options
 * @property {Object} connector LoopBack connector.
 * @property {*} [*] Other&nbsp;connector properties.
 *   See the relevant connector documentation.
 */

loopback.createDataSource = function(name, options) {
  return this.registry.createDataSource.apply(this.registry, arguments);
};

/**
 * Get an in-memory data source. Use one if it already exists.
 *
 * @param {String} [name] The name of the data source.
 * If not provided, the `'default'` is used.
 */

loopback.memory = function(name) {
  return this.registry.memory.apply(this.registry, arguments);
};

/**
 * Set the default `dataSource` for a given `type`.
 * @param {String} type The datasource type.
 * @param {Object|DataSource} dataSource The data source settings or instance
 * @returns {DataSource} The data source instance.
 *
 * @header loopback.setDefaultDataSourceForType(type, dataSource)
 */

loopback.setDefaultDataSourceForType = function(type, dataSource) {
  return this.registry.setDefaultDataSourceForType.apply(this.registry, arguments);
};

/**
 * Get the default `dataSource` for a given `type`.
 * @param {String} type The datasource type.
 * @returns {DataSource} The data source instance
 */

loopback.getDefaultDataSourceForType = function(type) {
  return this.registry.getDefaultDataSourceForType.apply(this.registry, arguments);
};

/**
 * Attach any model that does not have a dataSource to
 * the default dataSource for the type the Model requests
 */

loopback.autoAttach = function() {
  return this.registry.autoAttach.apply(this.registry, arguments);
};

loopback.autoAttachModel = function(ModelCtor) {
  return this.registry.autoAttachModel.apply(this.registry, arguments);
};

// temporary alias to simplify migration of code based on <=2.0.0-beta3
// TODO(bajtos) Remove this in v3.0
Object.defineProperty(loopback, 'DataModel', {
  get: function() {
    return this.registry.DataModel;
  }
});

/*!
 * Built in models / services
 */

require('./builtin-models')(loopback);
