'use strict';

var _ = require('underscore')
  , Marionette = require('marionette')
  , rivets = require('rivets')
  , RepoView = require('./repo-view');

var fs = require('fs')
  , tpl = fs.readFileSync(__dirname + '/../templates/rank.html');

// Constants for key codes
var keys = {
  ENTER: 13
};

/**
 * Top-level view for rank feature. Displays search field and list of repos.
 */
var RankView = Marionette.CompositeView.extend({
  className: 'rank-container',
  template: _.template(tpl),
  itemView: RepoView,
  itemViewContainer: '[data-ui=list-container]',
  events: {
    'keyup [data-ui=search-input]': 'onKeyUp'
  },

  /**
   * Focus search input.
   */
  focus: function () {
    var input = this.$('[data-ui=search-input]');
    setTimeout(function () {
      input.focus();
      input.select();
    }, 250);
  },

  /**
   * Handle `keyup` event on search input.
   */
  onKeyUp: function (event) {
    if (event.which === keys.ENTER) {
      var name = $.trim(this.$('[data-ui=search-input]').val());
      this.model.set('name', name);
      this.focus();
      return false;
    }
  },

  onRender: function () {
    // Configure rivets
    if (this._binding) { this._binding.unbind(); }
    this._binding = rivets.bind(this.$el, {model: this.model});
    this.focus();
  },

  onClose: function () {
    // Clean up rivets
    if (this._binding) { this._binding.unbind(); }
  }
});

module.exports = RankView;
