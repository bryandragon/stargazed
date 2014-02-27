'use strict';

var Marionette = require('marionette');

/**
 * Router for rank feature.
 */
var RankRouter = Marionette.AppRouter.extend({
  appRoutes: {
    '': 'index',
    ':name': 'show'
  }
});

module.exports = RankRouter;
