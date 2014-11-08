'use strict';

/**
 * @ngdoc overview
 * @name angularMyoDemoApp
 * @description
 * # angularMyoDemoApp
 *
 * Main module of the application.
 */
angular
  .module('angularMyoDemoApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngMyo'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
