/*
	高京
	2018-06-29

	debug模块
*/

const Debuging = true;

define(function() {
    return {
        log: (message) => {
            if (Debuging === true)
                console.log(message);
        },
        warn: (message) => {
            if (Debuging === true)
                console.warn(message);
        },
        error: (message) => {
            if (Debuging === true)
                console.error(message);
        },
        debug: (message) => {
            if (Debuging === true)
                console.debug(message);
        }
    };
});