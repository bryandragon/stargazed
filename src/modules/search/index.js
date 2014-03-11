'use strict';

var angular = require('angular');

/**
 * Module for search feature.
 */

module.exports = angular.module('stargazed.search', [])
  .directive('sgSearch', require('./directive'))
  .controller('SearchController', require('./controller'));
