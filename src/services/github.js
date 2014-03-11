'use strict';

var $ = require('jquery');

/**
 * Bare bones wrapper for the GitHub API.
 */

module.exports = ['$q', function ($q) {

  // Constants for HTTP verbs
  var http = {
    HEAD: 'HEAD',
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  var service = {

    // The GitHub API endpoint
    endpoint: 'https://api.github.com',

    // The GitHub API version
    version: 'v3',

    /**
     * Fetch an organization.
     */
    getOrg: function (name) {
      return service.exec(http.GET, '/orgs/:name', {name: name});
    },

    /**
     * Fetch an organization's repos.
     */
    getOrgRepos: function (name, params) {
      return service.exec(http.GET, '/orgs/:name/repos', {name: name}, params)
    },

    /**
     * Executes a GitHub API request.
     */
    exec: function (method, path, context, params) {
      method && (method = method.toUpperCase());

      var deferred = $q.defer()
        , data;

      if (!method || !http.hasOwnProperty(method)) {
        return deferred.reject('Invalid request method');
      }

      if (!path) {
        return deferred.reject('Invalid request path');
      }

      path = service.preparePath(method, path, context, params);

      if (method === http.HEAD || method === http.GET) {
        data = {};
      }
      else {
        data = params || {};
      }

      $.ajax({
        url: path,
        type: method,
        data: data,
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Accept', 
            'application/vnd.github.' + service.version + '+json');
        },
        success: function (data, status, xhr) {
          deferred.resolve(data);
        },
        error: function (xhr, status, error) {
          deferred.reject(error);
        }
      });

      return deferred.promise;
    },

    /**
     * Prepare a URL path for a request. If `path` contains placeholders, they will be resolved
     * by substituting values from the provided `context`. Placeholders should take the form `:org`.
     * If a `params` object is provided for a GET request, its key-value pairs will be URI-encoded
     * and attached to the returned path as a query string.
     *
     * Example:
     *   GitHub.preparePath('/repos/:owner/:repo/commits',
     *     {owner: 'Netflix', repo: 'asgard'}, {per_page: 100});
     *   // => '/repos/Netflix/asgard/commits?per_page=100'
     */
    preparePath: function (method, path, context, params) {
      var rawPathParts = path.split('/')
        , resolvedPathParts = [];

      $.each(rawPathParts, function (i, part) {
        if (part.charAt(0) === ':') {
          resolvedPathParts.push(context[part.substr(1)]);
        }
        else {
          resolvedPathParts.push(part);
        }
      });

      path = resolvedPathParts.join('/');
      path = service.endpoint + ((path.charAt(0) !== '/') ? ('/' + path) : path);

      if (method === http.GET && params) {
        path += '?' + objectToParams(params);
      }

      return path;
    }

  };

  /**
   * Utility function to convert an object into a URI-encoded string.
   */
  function objectToParams(obj) {
    if (!obj) { return ''; }

    var pairs = []
      , prop;

    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        pairs.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
      }
    }

    return pairs.join('&');
  }

  return service;
}];
