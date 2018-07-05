"use strict";

/*
	高京
	2018-06-29

	debug模块
*/

var Debuging = true;

define(function () {
    return {
        log: function log(message) {
            if (Debuging === true) console.log(message);
        },
        warn: function warn(message) {
            if (Debuging === true) console.warn(message);
        },
        error: function error(message) {
            if (Debuging === true) console.error(message);
        },
        debug: function debug(message) {
            if (Debuging === true) console.debug(message);
        }
    };
});
