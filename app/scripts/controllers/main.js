'use strict';

(function() {
    angular.module('angularMyoDemoApp')
        .controller('MainCtrl', function ($scope, Myo) {
            var self = this;
            self.locked = false;

            var rotateOffset, leftOffset, topOffset, rotate, top, left;
            var button = angular.element('#moveButton');

            var options = {
                broadcastOnConnected: false,
                broadcastOnDisconnected: false
            };

            var reset = function() {
                rotateOffset = 0;
                leftOffset = 0;
                topOffset = 0;
                rotate = 0;
                top = 0;
                left = 0;
            };
            reset();

            var refreshButtonPosition = function(classToAdd) {
                if(classToAdd) {
                    button.addClass(classToAdd);
                }
                button.css('transform', 'rotate(' + rotate + 'deg)');
                button.css('top', top + 'px');
                button.css('left', left + 'px');
                if(classToAdd) {
                    setTimeout(function(){button.removeClass(classToAdd)}, 500);
                }
            };

            $scope.$on('ngMyoLock', function(event, myoDeviceId) {
                self.locked = true;
            });
            $scope.$on('ngMyoUnlock', function(event, myoDeviceId) {
                self.locked = false;
            });

            Myo.on('fist', function(myoDevice) {
                    reset();
                    refreshButtonPosition();
                })
                .on('wave_in', function(myoDevice) {
                    left -= 200;
                    refreshButtonPosition('slide-animation');
                })
                .on('wave_out', function(myoDevice) {
                    left += 200;
                    refreshButtonPosition('slide-animation');
                })
                .on('fingers_spread', function(myoDevice) {
                    myoDevice.setLastRpyAsOffset();
                })
                .on('rest', function(myoDevice) {
                    myoDevice.clearRpyOffset();

                    rotateOffset = rotate;
                    leftOffset = left;
                    topOffset = 0;
                    top = 0;

                    refreshButtonPosition('fall-animation');
                })
                .on('orientation', function(myoDevice, orientationData) {
                    var round = function(value) {
                        return Math.round(value * 100) /100;
                    };
                    if(orientationData.rpyDiff) {
                        var rpyDiff = orientationData.rpyDiff;

                        rotate = rotateOffset + (90/3 * round(rpyDiff.roll));
                        top = topOffset - (window.screen.availHeight / 6) * round(rpyDiff.pitch);
                        left = leftOffset + (window.screen.availWidth / 6) * round(rpyDiff.yaw);

                        refreshButtonPosition();
                    }
                })
                .start(options);
        });
})();
