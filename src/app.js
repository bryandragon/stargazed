'use strict';

var angular = require('angular');

angular.module('stargazed', [])
  .service('GitHub', require('./common/services/github'));
