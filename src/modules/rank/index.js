'use strict';

/**
 * Entry point for the `Rank' module.
 */
var Rank = {
  start: function (options) {
    var Marionette = require('marionette')
      , App = require('../../app')
      , RankController = require('./controller')
      , RankRouter = require('./router');

    App.module('Rank', function () {
      this.controller = new RankController({service: options.service, region: options.region});
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
