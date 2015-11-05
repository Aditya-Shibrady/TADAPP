/*
 * sabre-dev-studio
 * https://github.com/SabreLabs/sabre-dev-studio-node
 *
 * Copyright (c) 2014 Sabre Corp
 * Licensed under the MIT license.
 */

'use strict';
var SabreDevStudio = (function() {
  require('simple-errors');
  function SabreDevStudio(options) {
    var that = this
      , loglevel = options.loglevel || 'warn'
      , url = require('url')
      , OAuth = require('oauth')
      , bunyan = require('bunyan')
      , log = bunyan.createLogger({name: 'SabreDevStudio', level: loglevel})
      , oauth2 = null
      , errorCodes = {
          400: 'BadRequest',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'NotFound',
          406: 'NotAcceptable',
          429: 'RateLimited',
          500: 'InternalServerError',
          503: 'ServiceUnavailable',
          504: 'GatewayTimeout'
        }
      ;
    delete options.loglevel;
    this.config = {};
    init(options);

    function init(options) {
      var clientID = function() {
        return new Buffer(that.config.client_id).toString('base64');
      };
      var clientSecret = function() {
        return new Buffer(that.config.client_secret).toString('base64');
      };
      var credentials = function() {
        return new Buffer(clientID() + ':' + clientSecret()).toString('base64');
      };
      var keys = ['client_id', 'client_secret', 'uri', 'access_token'];
      keys.forEach(function(key) {
        that.config[key] = options[key];
      });
      oauth2 = new OAuth.OAuth2(
        clientID(),
        clientSecret(),
        that.config.uri,
        null,
        '/v1/auth/token',
        {'Authorization': 'Basic ' + credentials()}
      );
      oauth2.useAuthorizationHeaderforGET(true);
    }

    this.get = function(endpoint, options, callback, retryCount) {
      this.request("GET", endpoint, "", options, callback, retryCount);
    };

    this.post = function(endpoint, post_body, options, callback, retryCount) {
      this.request("POST", endpoint, post_body, options, callback, retryCount);
    };

    this.request = function(method, endpoint, post_body, options, callback, retryCount) {
      if (typeof retryCount === 'undefined') {
        retryCount = 1; // by default one retry
      }
      var headers= {'Authorization': oauth2.buildAuthHeader(this.config.access_token) };
      for( var key in options) {
        headers[key]= options[key];
      }
      options = options || {};
      var requestUrl = url.parse(that.config.uri + endpoint);
      requestUrl.query = options;
      requestUrl = url.format(requestUrl);
      var cb = callback || function(error, data) { log.info(error, data); };
      var fetchAccessToken = function(endpoint, options, cb, retryCount) {
        log.info('Fetching fresh access token');
        oauth2.getOAuthAccessToken(
          '',
          {'grant_type':'client_credentials'},
          function (error, access_token) {
            if (error) {
              var err = Error.http(error.statusCode, errorCodes[error.statusCode], error.data, error);
              log.error('Error:', err);
            } else {
              that.config.access_token = access_token;
              that.request(method, endpoint, post_body, options, cb, retryCount);
            }
          }
        );
      };
      if (that.config.access_token) {
        oauth2._request(method, requestUrl, headers, post_body, null, function(error, data, response) {
          if (!error && response.statusCode === 200) {
            cb(null, data, response);
          } else if (error.statusCode === 401 && retryCount >= 0) {
            fetchAccessToken(endpoint, options, cb, --retryCount);
          } else {
            if (error.data === '') { error.data = requestUrl; }
            var err = Error.http(error.statusCode, errorCodes[error.statusCode], error.data, error);
            log.error('Error:', err);
            cb(err, data, response);
          }
        });
      } else {
        if (retryCount >= 0) {
          fetchAccessToken(endpoint, options, cb, --retryCount);
        }
      }
    };
  }

  return SabreDevStudio;
})();

module.exports = SabreDevStudio;
