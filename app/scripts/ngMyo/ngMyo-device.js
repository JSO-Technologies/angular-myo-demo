'use strict';

function MyoDevice(id, version, ws, fnsByEvent) {
    var self = this;

    this.id = id;
    this.version = version;
    this.ws = ws;
    this.fnsByEvent = fnsByEvent || new Map();
    this.currentPose;

    /************************** Orientation request number **************************/
    var orientationRequestNb = 0;

    this.incrementOrientationRequest = function() {
        return orientationRequestNb++;
    };

    /*********************************** Myo Lock **********************************/
    var locked = false;

    /**
     * Lock the device and perform a double short vibration
     */
    this.lock = function() {
        locked = true;
        self.vibrate('short');
        self.vibrate('short');
    };

    /**
     * Unlock the device and perform a medium vibration
     */
    this.unlock = function() {
        locked = false;
        self.vibrate();
    };

    /**
     * Lock if device is unlocked, Unlock if device is locked
     */
    this.lockOrUnlock = function() {
        if(self.isLocked()) {
            self.unlock();
        }
        else {
            self.lock();
        }
    };

    /**
     * Test if device is locked
     * @returns {boolean} - true if device is locked
     */
    this.isLocked = function() {
        return locked;
    };

    /********************************* Myo vibration ********************************/
    /**
     * Vibrate myo device
     * @param intensity - 'short' | 'medium' | 'long'
     */
    this.vibrate = function(intensity) {
        var intensity = intensity || 'medium';
        self.ws.send(JSON.stringify(['command',{
            "command": "vibrate",
            "myo": self.id,
            "type": intensity
        }]));
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

    /**
     * Trigger pose callbacks with the MyoDevice as argument
     * @param data - websocket pose data
     */
    this.onPose = function(data) {
        self.currenPose = data.pose;
        performCallbackFns(data.pose);
    };

    /**
     * Trigger arm recognition callbacks with the MyoDevice as argument
     * @param data - websocket pose data
     */
    this.onArmRecognized = function(data) {
        performCallbackFns('arm_recognized');
    };

    /**
     * Trigger arm lost callbacks with the MyoDevice as argument
     * @param data - websocket pose data
     */
    this.onArmLost = function(data) {
        performCallbackFns('arm_lost');
    };

    /**
     * Call every registered callbacks for the myo event
     * @param event - the myo event name
     */
    var performCallbackFns = function(event) {
        var fns = self.fnsByEvent.get(event);
        if(fns) {
            fns.forEach(function(fn) {
                fn(self);
            });
        }
    }
}