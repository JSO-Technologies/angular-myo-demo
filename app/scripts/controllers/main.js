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

        $scope.$on('ngMyoLock', function(event, myoDeviceId) {
            alert('Myo device ' + myoDeviceId + ' locked');
        });
        $scope.$on('ngMyoUnlock', function(event, myoDeviceId) {
            alert('Myo device ' + myoDeviceId + ' unlocked');
        });
        Myo.on('fist', function(myoDevice) {
            alert('Myo device ' + myoDevice.id + ' fist');
        });
        Myo.start(options);
    });
