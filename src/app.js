'use strict';

require('./common/config/rivets.js');

var _ = require('underscore')
  , Backbone = require('backbone')
  , Marionette = require('marionette')
  , GitHubService = require('./common/services/github')
  , Repos = require('./common/models/repos');

var App = new Marionette.Application();

/**
 * Request a `Repos` collection via Backbone.Wreqr. If the `comparator` option is provided,
 * it will be set on the returned collection.
 */
App.reqres.setHandler('entity:repos', function (models, options) {
  var collection = new Repos(models, options);

  if (options && options.comparator) {
    collection.comparator = options.comparator;
  }

  return collection;
});

App.addInitializer(function (options) {
  var Rank = require('./modules/rank');

  App.addRegions({
    main: options.mainRegion
  });

  Rank.start({
    service: new GitHubService,
    region: App.getRegion('main')
  });

  Backbone.history.start();
});

module.exports = App;
