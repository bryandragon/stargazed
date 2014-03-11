'use strict';

/**
 * Controller for search feature.
 */

module.exports = ['$scope', '$rootScope', function SearchController($scope, $rootScope) {
  // Constants for key codes
  var keys = {
    ENTER: 13
  };

  $scope.showInstructions = false;

  $scope.onKeyUp = function (event) {
    if (event.which === keys.ENTER) {
      $rootScope.$broadcast('sg:search', $scope.query);
    }
  };
}];
