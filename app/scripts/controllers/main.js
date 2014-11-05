'use strict';

/**
 * @ngdoc function
 * @name angularMyoDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularMyoDemoApp
 */
angular.module('angularMyoDemoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
