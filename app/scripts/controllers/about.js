'use strict';

/**
 * @ngdoc function
 * @name angularMyoDemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularMyoDemoApp
 */
angular.module('angularMyoDemoApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
