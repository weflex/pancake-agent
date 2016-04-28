'use strict';

const app = require('../index.js')('./server1');
const request = require('supertest');
const Token = app.loopback.AccessToken.extend('MyToken');
const ds = app.loopback.createDataSource({connector: app.loopback.Memory});
Token.attachTo(ds);

describe('loopback.token(options)', function() {
  beforeEach(createTestingToken);
  it('should populate req.token from the query string', function(done) {
    createTestAppAndRequest(this.token, done)
      .get('/?access_token=' + this.token.id)
      .expect(200)
      .end(done);
  });
  
});

function createTestingToken(done) {
  var test = this;
  Token.create({userId: '123'}, function(err, token) {
    if (err) return done(err);
    test.token = token;
    done();
  });
}

function createTestAppAndRequest(testToken, settings, done) {
  var app = createTestApp(testToken, settings, done);
  return request(app);
}

function createTestApp(testToken, settings, done) {
  done = arguments[arguments.length - 1];
  if (settings == done) settings = {};
  settings = settings || {};

  var appSettings = settings.app || {};
  var modelSettings = settings.model || {};
  var tokenSettings = extend({
    model: Token,
    currentUserLiteral: 'me'
  }, settings.token);

  var app = loopback();

  app.use(loopback.cookieParser('secret'));
  app.use(loopback.token(tokenSettings));
  app.get('/token', function(req, res) {
    res.cookie('authorization', testToken.id, {signed: true});
    res.cookie('access_token', testToken.id, {signed: true});
    res.end();
  });
  app.get('/', function(req, res) {
    try {
      assert(req.accessToken, 'req should have accessToken');
      assert(req.accessToken.id === testToken.id);
    } catch (e) {
      return done(e);
    }
    res.send('ok');
  });
  app.get('/check-access', function(req, res) {
    res.status(req.accessToken ? 200 : 401).end();
  });
  app.use('/users/:uid', function(req, res) {
    var result = {userId: req.params.uid};
    if (req.query.state) {
      result.state = req.query.state;
    } else if (req.url !== '/') {
      result.state = req.url.substring(1);
    }
    res.status(200).send(result);
  });
  app.use(loopback.rest());
  app.enableAuth();

  Object.keys(appSettings).forEach(function(key) {
    app.set(key, appSettings[key]);
  });

  var modelOptions = {
    acls: [
      {
        principalType: 'ROLE',
        principalId: '$everyone',
        accessType: ACL.ALL,
        permission: ACL.DENY,
        property: 'deleteById'
      }
    ]
  };

  Object.keys(modelSettings).forEach(function(key) {
    modelOptions[key] = modelSettings[key];
  });

  var TestModel = loopback.PersistedModel.extend('test', {}, modelOptions);

  TestModel.attachTo(loopback.memory());
  app.model(TestModel);

  return app;
}