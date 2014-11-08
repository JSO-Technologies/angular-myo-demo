'use strict';

(function() {
    function MyoDevice(id, version) {
        this.id = id;
        this.version = version;

        /************************** Orientation request number **************************/
        var orientationRequestNb = 0;

        this.incrementOrientationRequest = function() {
            return orientationRequestNb++;
        };

        /*********************************** Myo Lock **********************************/
        var locked = false;

        this.lock = function() {
            locked = true;
        };

        this.unlock = function() {
            locked = false;
        };

        this.isLocked = function() {
            return locked;
        };

        /********************************* Event trigger ********************************/
        this.onOrientation = function(data, rpy) {
            /*
            console.log('Device onOrientation');
            console.log(data);
            console.log('Roll Pitch Yaw');
            console.log(rpy);
            */
        };

        this.onPose = function(data) {
            console.log(data);
        };

        this.onArmRecognized = function(data) {
            console.log('Device onArmRecognized');
            console.log(data);
        };

        this.onArmLost = function(data) {
            console.log('Device onArmLost');
            console.log(data);
        };
    }

    function Myo($rootScope, $window, MyoOptions, MyoOrientation) {
        var instanceOptions = {};
        var devices = new Map();

        /************************************** helpers ***************************************/
        /**
         * Get devise from id
         * @param id - the device id
         * @returns the {@link MyoDevice}
         */
        this.getDevice = function(id) {
            return devices.get(id);
        };

        /**
         * Test if orientation request should be skipped.
         *
         * ngMyo skip the request if the instanceOptions.skipOneOrientationEvery option is defined and the request number is n * instanceOptions.skipOneOrientationEvery
         * ex : instanceOptions.skipOneOrientationEvery = 2, ngMyo will skip 1 request every 2 requests
         *
         * @param device - the {@link MyoDevice}
         * @returns {skipOneOrientationEvery|*|boolean} - truthy if request should be skipped
         */
        var shouldSkipOrientation = function(device) {
            var requestNb = device.incrementOrientationRequest();
            return instanceOptions.skipOneOrientationEvery && requestNb % instanceOptions.skipOneOrientationEvery === 0;
        };

        /**
         * Test if variable is integer
         *
         * @param variable - the value du test
         * @returns {boolean} - true if variable is an integer
         */
        var isInteger = function(variable) {
            return typeof variable === 'number' && (variable % 1) === 0;
        };

        /************************************** start with options ***************************************/
        /**
         * Define ngMyo options and initialize websocket listeners
         * @param customOptions - options. If not defined, ngMyo will take default options
         */
        this.start = function(customOptions) {
            if(customOptions) {
                instanceOptions.useRollPitchYaw = customOptions.useRollPitchYaw !== undefined ? customOptions.useRollPitchYaw : MyoOptions.useRollPitchYaw;
                instanceOptions.rollPitchYawScale = customOptions.rollPitchYawScale !== undefined ? customOptions.rollPitchYawScale : MyoOptions.rollPitchYawScale;
                instanceOptions.broadcastOnConnected = customOptions.broadcastOnConnected !== undefined ? customOptions.broadcastOnConnected : MyoOptions.broadcastOnConnected;
                instanceOptions.broadcastOnDisconnected = customOptions.broadcastOnDisconnected !== undefined ? customOptions.broadcastOnDisconnected : MyoOptions.broadcastOnDisconnected;
                instanceOptions.skipOneOrientationEvery = isInteger(customOptions.skipOneOrientationEvery) ? customOptions.skipOneOrientationEvery : MyoOptions.skipOneOrientationEvery;
            }
            else {
                instanceOptions = MyoOptions;
            }

            initialize();
        };

        /**
         * Initialize websocket listeners
         */
        var initialize = function() {
            if (!$window.WebSocket){
                console.error('Socket not supported by browser');
            }

            var ws = new $window.WebSocket(MyoOptions.wsUrl + MyoOptions.apiVersion);
            ws.onmessage = function(message) {
                var data = JSON.parse(message.data);
                if(data[0] === 'event') {
                    switch(data[1].type) {
                        case 'orientation' :
                            triggerOrientation(data[1]);
                            break;
                        case 'pose' :
                            triggerPose(data[1]);
                            break;
                        case 'connected' :
                            registerDevice(data[1]);
                            break;
                        case 'disconnected' :
                            unregisterDevice(data[1]);
                            break;
                        case 'arm_recognized' :
                            triggerArmRecognized(data[1]);
                            break;
                        case 'arm_lost' :
                            triggerArmLost(data[1]);
                            break;
                        default :
                            console.log(data[1]);
                            break;
                    }
                }
            };

            var registerDevice = function(data) {
                devices.set(data.myo, new MyoDevice(data.myo, data.version.join('.')));
                if(instanceOptions.broadcastOnConnected) {
                    $rootScope.$broadcast('ngMyoConnected', data.myo);
                }
            };

            var unregisterDevice = function(data) {
                devices.delete(data.myo);
                if(instanceOptions.broadcastOnDisconnected) {
                    $rootScope.$broadcast('ngMyoDisconnected', data.myo);
                }
            };

            var triggerOrientation = function(data) {
                var device = devices.get(data.myo);
                if(device && !device.isLocked() && !shouldSkipOrientation(device)) {
                    var rpy;
                    if(instanceOptions.useRollPitchYaw) {
                        rpy = MyoOrientation.calculateRPY(data.orientation, instanceOptions.rollPitchYawScale);
                    }
                    device.onOrientation(data, rpy);
                }
            };

            var triggerPose = function(data) {
                var device = devices.get(data.myo);
                if(device && !device.isLocked()) {
                    device.onPose(data);
                }
            };

            var triggerArmRecognized = function(data) {
                var device = devices.get(data.myo);
                if(device) {
                    device.onArmRecognized(data);
                }
            };

            var triggerArmLost = function(data) {
                var device = devices.get(data.myo);
                if(device) {
                    device.onArmLost(data);
                }
            };
        };
    }

    angular.module('ngMyo')
        .service('Myo', ['$rootScope', '$window', 'MyoOptions', 'MyoOrientation', Myo]);
})();