'use strict';

var Backbone = require('backbone')
  , Marionette = require('marionette')
  , RankModel = require('./model')
  , RankView = require('./views/rank-view')
  , App = require('../../app');

// Cache for repos data
var cache = {};

/**
 * Controller for rank feature.
 */
var RankController = Marionette.Controller.extend({
  initialize: function (options) {
    _.bindAll(this, 'index', 'show', 'fetchOrgRepos', 'reset', 'onNameChange');

    this.model = options.model || new RankModel;
    this.collection =
      options.collection || App.request('entity:repos', [], {comparator: this.sort});
    this.service = options.service;
    this.view = new RankView({
      model: this.model,
      collection: this.collection
    });

    this.listenTo(this.model, 'change:name', this.onNameChange);

    // Render main view into passed-in region
    if (options.region) { options.region.show(this.view); }
  },

  /**
   * Handle `index` route.
   */
  index: function () {
    this.reset();
  },

  /**
   * Handle `show` route.
   */
  show: function (name) {
    this.model.set('name', name);
  },

  /**
   * Fetch repos for org with `name`.
   */
  fetchOrgRepos: function (name) {
    // Bail if already loading
    if (this.model.get('loading')) { return; }

    this.reset();
    this.trigger('change:name', name);

    // No sense fetching data if name is blank
    if (!name) { return; }

    // Use cached data if available
    if (cache.hasOwnProperty(name)) {
      this.collection.reset(cache[name]);
      return;
    }

    var controller = this;

    this.model.set('loading', true);

    // Ensure org exists
    return this.service.getOrg(name)
      .then(function () {
        // Fetch org repos
        return controller.service.getOrgRepos(name, {per_page: 100});
      }, function () {
        // Invalid org
        controller.model.set('message', 'Invalid GitHub organization.');
        controller.model.set('loading', false);
      })
      .then(function (data) {
        // Cache org repos
        cache[name] = data;
        controller.collection.reset(data);
        controller.model.set('loading', false);
      }, function () {
        // Unable to fetch org repos
        controller.model.set('message', 'Unable to fetch repos.');
        controller.model.set('loading', false);
      });
  },

  /**
   * Reset model state.
   */
  reset: function () {
    this.model.set({loading: false, message: null});
    this.collection.reset();
  },

  /**
   * Handle `change:name` model event.
   */
  onNameChange: function (model, name) {
    this.fetchOrgRepos(name);
  },

  /**
   * Comparator to sort repos by `stargazers_count`.
   */
  sort: function (a, b) {
    a = a.get('stargazers_count');
    b = b.get('stargazers_count');

    if (a > b) { return -1; }
    if (a < b) { return 1; }

    return 0;
  }
});

module.exports = RankController;
