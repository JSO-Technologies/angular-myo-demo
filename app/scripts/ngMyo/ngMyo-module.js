'use strict';

(function() {
   angular.module('ngMyo', [])
       .constant('MyoOptions', {
           wsUrl:                   'ws://127.0.0.1:10138/myo/',
           apiVersion:              1,
           useRollPitchYaw:         true,
           broadcastOnConnected:    true,
           broadcastOnDisconnected: true,
           skipOneOrientationEvery: 2,
           rollPitchYawScale:       18
       });
})();