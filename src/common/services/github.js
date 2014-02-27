'use strict';

var $ = require('jquery')
  , _ = require('underscore')
  , RSVP = require('rsvp');

// Constants for HTTP verbs
var http = {
  HEAD: 'HEAD',
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

/**
 * Bare bones wrapper for the GitHub API.
 */
function GitHubService() {
}

/**
 * The GitHub API endpoint.
 */
GitHubService.endpoint = 'https://api.github.com';

/**
 * The GitHub API version.
 */
GitHubService.version = 'v3';

/**
 * Fetch an organization.
 */
GitHubService.prototype.getOrg = function (name) {
  return this.exec(http.GET, '/orgs/:name', {name: name});
};

/**
 * Fetch an org's repos.
 */
GitHubService.prototype.getOrgRepos = function (name, params) {
  return this.exec(http.GET, '/orgs/:name/repos', {name: name}, params)
};

/**
 * Executes a GitHub API request.
 */
GitHubService.prototype.exec = function (method, path, context, params) {
  var service = this;

  method && (method = method.toUpperCase());

  return new RSVP.Promise(function (resolve, reject) {
    var data;

    if (!method || !http.hasOwnProperty(method)) {
      return reject('Invalid request method');
    }

    if (!path) {
      return reject('Invalid request path');
    }

    path = service.preparePath(method, path, context, params);

    if (method === http.HEAD && method === http.GET) {
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
          'application/vnd.github.' + GitHubService.version + '+json');
      },
      success: function (data, status, xhr) {
        resolve(data);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
};

/**
 * Prepare a URL path for a request. If `path` contains placeholders, they will be resolved
 * by substituting values from the provided `context`. Placeholders should take the form `:org`.
 * If a `params` object is provided for a GET request, its key-value pairs will be URI-encoded
 * and attached to the returned path as a query string.
 *
 * Example:
 *   var ghs = new GitHubService();
 *   ghs.preparePath('/repos/:owner/:repo/commits',
 *     {owner: 'Netflix', repo: 'asgard'}, {per_page: 100});
 *   // => '/repos/Netflix/asgard/commits?per_page=100'
 */
GitHubService.prototype.preparePath = function (method, path, context, params) {
  var rawPathParts = path.split('/')
    , resolvedPathParts = [];

  _.each(rawPathParts, function (part, i) {
    if (part.charAt(0) === ':') {
      resolvedPathParts.push(context[part.substr(1)]);
    }
    else {
      resolvedPathParts.push(part);
    }
  });

  path = resolvedPathParts.join('/');
  path = GitHubService.endpoint + ((path.charAt(0) !== '/') ? ('/' + path) : path);

  if (method === http.GET && params) {
    path += '?' + objectToParams(params);
  }

  return path;
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

module.exports = GitHubService;
