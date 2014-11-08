'use strict';

/**
 * @ngdoc function
 * @name angularMyoDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularMyoDemoApp
 */
angular.module('angularMyoDemoApp')
    .controller('MainCtrl', function ($scope, Myo) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        var options = {
            broadcastOnConnected: false,
            broadcastOnDisconnected: false
        };

        Myo.start(options);

    });
