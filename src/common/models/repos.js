'use strict';

var Backbone = require('backbone')
  , Repo = require('./repo');

/**
 * Collection of GitHub repos.
 */
var Repos = Backbone.Collection.extend({
  model: Repo
});

module.exports = Repos;
