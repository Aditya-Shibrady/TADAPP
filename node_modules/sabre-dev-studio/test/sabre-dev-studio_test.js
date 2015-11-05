'use strict';

/**
 * WARNING: tests use setTimeout to delay checks if nock'd service calls were done.
 * It is necessary because if they are done immediately (without delay) after the call to nock'd service they will very probably not be executed.
 * Nock does not provide hook to execute assertions upon the nocked HTTP call is done (would be optimal).
 */

var SabreDevStudio = require('../lib/sabre-dev-studio.js');
var nock = require('nock');
nock.disableNetConnect();

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

module.exports = {
  setUp: function(callback) {
    this.sabre_dev_studio = new SabreDevStudio({
      client_id:     'V1:USER:GROUP:DOMAIN',
      client_secret: 'PASSWORD',
      uri:           'https://api.test.sabre.com'
    });
    callback();
  },
  tearDown: function(callback) {
    callback();
  },
  testConfiguration: function(test) {
    test.equal('V1:USER:GROUP:DOMAIN', this.sabre_dev_studio.config.client_id);
    test.done();
  },
  testBaseAPICallFetchesAccessToken: function(test) {
    var that = this;
    var base_url = "https://api.test.sabre.com";
    var token = 'this_is_a_fake_token';
    var stub_request = nock(base_url)
        .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
        .reply(200, { access_token: token })
        ;
    var stub_request_get = nock(base_url)
        .get('/v1/lists/supported/shop/themes')
        .replyWithFile(200, __dirname + '/fixtures/air_shopping_themes.json')
        ;
    this.sabre_dev_studio.get('/v1/lists/supported/shop/themes', {}, function(error, data) {
      test.ok(data);
    });
    setTimeout(function () {
      test.ok(stub_request.isDone());
      test.ok(stub_request_get.isDone());
      test.equal(that.access_token, that.sabre_dev_studio.access_token);
      test.done();
    }, 50);
  },
  testBaseAPIHandlesRetry: function(test) {
    var that = this;
    var base_url = "https://api.test.sabre.com";
    var token = 'this_is_a_fake_token';
    var stub_1st_request_auth_token = nock(base_url)
            .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
            .reply(200, { access_token: token })
        ;
    var stub_2nd_request_auth_token = nock(base_url)
            .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
            .reply(200, { access_token: token })
        ;
    // simulate that token expired
    var stub_request_get_1st = nock(base_url)
            .get('/v1/lists/supported/shop/themes')
            .replyWithFile(401, __dirname + '/fixtures/air_shopping_themes_401_invalid_credentials.json')
        ;
    // and for next request we will have refreshed auth token so service will reply OK
    var stub_request_get_2nd = nock(base_url)
            .get('/v1/lists/supported/shop/themes')
            .replyWithFile(200, __dirname + '/fixtures/air_shopping_themes.json')
        ;
    this.sabre_dev_studio.get('/v1/lists/supported/shop/themes', {}, function(error, data) {
      test.ok(data);
    });
    setTimeout(function () {
      test.ok(stub_1st_request_auth_token.isDone());
      test.ok(stub_request_get_1st.isDone());
      test.ok(stub_2nd_request_auth_token.isDone());
      test.ok(stub_request_get_2nd.isDone());
      test.equal(that.access_token, that.sabre_dev_studio.access_token);
      test.done();
    }, 100);
  },
  testBaseAPIHandlesMaxRetries: function(test) {
    var that = this;
    var base_url = "https://api.test.sabre.com";
    var token = 'this_is_a_fake_token';
    var stub_1st_request_auth_token = nock(base_url)
            .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
            .reply(200, { access_token: token })
        ;
    var stub_2nd_request_auth_token = nock(base_url)
            .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
            .reply(200, { access_token: token })
        ;
    // simulate that token expired
    var stub_request_get_1st = nock(base_url)
            .get('/v1/lists/supported/shop/themes')
            .replyWithFile(401, __dirname + '/fixtures/air_shopping_themes_401_invalid_credentials.json')
        ;
    // another token problem
    var stub_request_get_2nd = nock(base_url)
            .get('/v1/lists/supported/shop/themes')
            .replyWithFile(401, __dirname + '/fixtures/air_shopping_themes_401_invalid_credentials.json')
        ;

    // setting loglevel to fatal, to effectively disable all logging, as this test checks error conditions which are logged.
    var sabre_dev_studio = new SabreDevStudio({
      client_id:     'V1:USER:GROUP:DOMAIN',
      client_secret: 'PASSWORD',
      uri:           'https://api.test.sabre.com',
      loglevel: 'fatal'
    });

    var MAX_RETRIES = 1; // do only one retry if first call (try number 0) was not successful
    sabre_dev_studio.get('/v1/lists/supported/shop/themes', {}, function(error) {
      test.equal(error.status, 401);
      test.equal(error.message, 'Unauthorized');
      test.ok(error);
    }, MAX_RETRIES);

    setTimeout(function () {
      test.ok(stub_1st_request_auth_token.isDone());
      test.ok(stub_request_get_1st.isDone());
      test.ok(stub_2nd_request_auth_token.isDone());
      test.ok(stub_request_get_2nd.isDone());
      test.equal(that.access_token, that.sabre_dev_studio.access_token);
      test.done();
    }, 100);
  },
  testNoMoreHttpCallsAfterFetchingAuthTokenFailed: function(test) {
    var base_url = "https://api.test.sabre.com";
    var stub_request_auth_token = nock(base_url)
            .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
            .reply(401, '{"error":"invalid_client","error_description":"Credentials are missing or the syntax is not correct"}')
        ;
    // setting loglevel to fatal, to effectively disable all logging, as this test checks error conditions which are logged.
    var sabre_dev_studio = new SabreDevStudio({
      client_id:     'V1:USER:GROUP:DOMAIN',
      client_secret: 'PASSWORD',
      uri:           'https://api.test.sabre.com',
      loglevel: 'fatal'
    });

    sabre_dev_studio.get('/v1/lists/supported/shop/themes', {}, {});

    setTimeout(function () {
      test.ok(stub_request_auth_token.isDone());
      test.done();
    }, 50);
  }
};
