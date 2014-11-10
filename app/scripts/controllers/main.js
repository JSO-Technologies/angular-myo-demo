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
        $scope.locked = false;
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        var rotateOffset = 0;
        var leftOffset = 0;
        var topOffset = 0;
        var rotate = 0;
        var top = 0;
        var left = 0;

        var options = {
            broadcastOnConnected: false,
            broadcastOnDisconnected: false
        };

        $scope.$on('ngMyoLock', function(event, myoDeviceId) {
            $scope.locked = true;
        });
        $scope.$on('ngMyoUnlock', function(event, myoDeviceId) {
            $scope.locked = false;
        });
        Myo.on('fingers_spread', function(myoDevice) {
            myoDevice.setLastRpyAsOffset();
        })
        .on('fist', function(myoDevice) {
            rotateOffset = 0;
            leftOffset = 0;
            topOffset = 0;
            rotate = 0;
            top = 0;
            left = 0;
            var button = angular.element('#moveButton');
            button.css('transform', '');
            button.css('left', '');
            button.css('top', '');
        })
        .on('wave_in', function(myoDevice) {
            left -= 200;
            var button = angular.element('#moveButton');
            button.addClass('fall-slide');
            button.css('left', left + 'px');
            setTimeout(function(){button.removeClass('fall-slide')}, 500);
        })
        .on('wave_out', function(myoDevice) {
            left += 200;
            var button = angular.element('#moveButton');
            button.addClass('fall-slide');
            button.css('left', left + 'px');
            setTimeout(function(){button.removeClass('fall-slide')}, 500);
        })
        .on('rest', function(myoDevice) {
            myoDevice.clearRpyOffset();

            rotateOffset = rotate;
            leftOffset = left;
            topOffset = 0;

            var button = angular.element('#moveButton');
            button.addClass('fall-animation');
            button.css('top', '0px');
            setTimeout(function(){button.removeClass('fall-animation')}, 500);
        })
        .on('orientation', function(myoDevice, orientationData) {
            var round = function(value) {
                return Math.round(value * 100) /100;
            }
            if(orientationData.rpyDiff) {
                var rpyDiff = orientationData.rpyDiff;

                rotate = rotateOffset + (90/3 * round(rpyDiff.roll));
                top = topOffset - (window.screen.availHeight / 6) * round(rpyDiff.pitch);
                left = leftOffset + (window.screen.availWidth / 6) * round(rpyDiff.yaw);

                var button = angular.element('#moveButton');
                button.css('transform', 'rotate(' + rotate + 'deg)');
                button.css('top', top + 'px');
                button.css('left', left + 'px');
            }
        })
        .start(options);
    });
