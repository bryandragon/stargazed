'use strict';

var _ = require('underscore')
  , _str = require('underscore.string')
  , Marionette = require('marionette')
  , rivets = require('rivets');

var fs = require('fs')
  , tpl = fs.readFileSync(__dirname + '/../templates/repo.html');

/**
 * Repo item view.
 */
var RepoView = Marionette.ItemView.extend({
  className: 'repo-view clearfix',
  template: _.template(tpl),
  templateHelpers: {
    numberFormat: _str.numberFormat
  },

  onRender: function () {
    // Configure rivets
    if (this._binding) { this._binding.unbind(); }
    this._binding = rivets.bind(this.$el, {model: this.model});
  },

  onClose: function () {
    // Clean up rivets
    if (this._binding) { this._binding.unbind(); }
  }
});

module.exports = RepoView;
