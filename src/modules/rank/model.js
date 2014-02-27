'use strict';

var Backbone = require('backbone');

/**
 * View model for rank feature.
 */
var RankModel = Backbone.Model.extend({
  defaults: {
    name: '',
    message: '',
    loading: false
  }
});

module.exports = RankModel;
