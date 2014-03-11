'use strict';

var angular = require('angular');

require('angular-route');

angular.module('stargazed', [
    'ngRoute'
  ])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
  }])
  .service('GitHub', require('./services/github'));
