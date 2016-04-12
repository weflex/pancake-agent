module.exports = function(registry) {
  
  // NOTE(bajtos) we must use static require() due to browserify limitations
  registry.Email = createModel(
    require('./models/email.json'),
    require('./models/email.js'));

  registry.Application = createModel(
    require('./models/application.json'),
    require('./models/application.js'));

  registry.AccessToken = createModel(
    require('./models/access-token.json'),
    require('./models/access-token.js'));

  registry.User = createModel(
    require('./models/user.json'),
    require('./models/user.js'));

  // registry.RoleMapping = createModel(
  //   require('./models/role-mapping.json'),
  //   require('./models/role-mapping.js'));

  // registry.Role = createModel(
  //   require('./models/role.json'),
  //   require('./models/role.js'));

  // registry.ACL = createModel(
  //   require('./models/acl.json'),
  //   require('./models/acl.js'));

  // registry.Scope = createModel(
  //   require('./models/scope.json'),
  //   require('./models/scope.js'));

  registry.Change = createModel(
    require('./models/change.json'),
    require('./models/change.js'));

  registry.Checkpoint = createModel(
    require('./models/checkpoint.json'),
    require('./models/checkpoint.js'));

  /*!
   * Automatically attach these models to dataSources
   */

  var dataSourceTypes = {
    DB: 'db',
    MAIL: 'mail'
  };

  registry.Email.autoAttach = dataSourceTypes.MAIL;
  registry.getModel('PersistedModel').autoAttach = dataSourceTypes.DB;
  registry.User.autoAttach = dataSourceTypes.DB;
  registry.AccessToken.autoAttach = dataSourceTypes.DB;
  // registry.Role.autoAttach = dataSourceTypes.DB;
  // registry.RoleMapping.autoAttach = dataSourceTypes.DB;
  // registry.ACL.autoAttach = dataSourceTypes.DB;
  // registry.Scope.autoAttach = dataSourceTypes.DB;
  registry.Application.autoAttach = dataSourceTypes.DB;

  function createModel(definitionJson, customizeFn) {
    var Model = registry.createModel(definitionJson);
    customizeFn(Model);
    return Model;
  }
};
