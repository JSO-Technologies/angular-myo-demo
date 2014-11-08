'use strict';

(function() {
    function MyoOrientation() {
        /**
         * Calculate the roll, pitch and yaw from orientation quanternion
         *
         * @param quat - a quaternion
         * @param scale - the scale (roll, pitch and yaw will be within [0, scale]
         * @returns {{roll: number, pitch: number, yaw: number}}
         */
        this.calculateRPY = function(quat, scale) {
            var rpyRad = {
                roll: Math.atan2(2 * (quat.w * quat.x + quat.y * quat.z), 1 - 2 * (quat.x * quat.x + quat.y * quat.y)),
                pitch: Math.asin(Math.max(-1, Math.min(1, 2 * (quat.w * quat.y - quat.z * quat.x)))),
                yaw: Math.atan2(2 * (quat.w * quat.z + quat.x * quat.y), 1 - 2 * (quat.y * quat.y + quat.z * quat.z))
            };

            return {
                roll: (rpyRad.roll + Math.PI)/(Math.PI * 2) * scale,
                pitch: (rpyRad.pitch + Math.PI/2)/Math.PI * scale,
                yaw: (rpyRad.yaw + Math.PI)/(Math.PI * 2) * scale
            };
        }
    }

    angular.module('ngMyo')
        .service('MyoOrientation', [MyoOrientation]);
})();