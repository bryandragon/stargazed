'use strict';

/**
 * Entry point for the `Rank' module.
 */
var Rank = {
  start: function (options) {
    options || (options = {});

    var _ = require('underscore')
      , Marionette = require('marionette')
      , App = require('../../app')
      , RankController = require('./controller')
      , RankRouter = require('./router');

    App.module('Rank', function () {
      this.controller = new RankController(_.pick(options, 'collection', 'region', 'service'));
      this.router = new RankRouter({controller: this.controller});

      this.onNameChange = function (name) {
        // Update URL fragment when org name changes
        this.router.navigate(name + '', {trigger: false});
      };

      this.listenTo(this.controller, 'change:name', this.onNameChange);
    });
  }
};

module.exports = Rank;
