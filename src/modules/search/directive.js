'use strict';

var angular = require('angular')
  , template = require('./templates/search.html');

module.exports = function SearchDirective($compile) {
  return {
    restrict: 'A',
    scope: {
      query: '@',
      showInstructions: '@'
    },
    controller: 'SearchController',
    template: template
  };
};
