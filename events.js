function eventListener(){
    var __listeners = new Array(), u = 'undefined', f = 'function';
    this.on = function(type, fn){
        if(typeof(fn) === f){
            if(typeof(__listeners[type]) === u){
                __listeners[type] = new Array();
            }
            __listeners[type].push(fn);
        }
    }
    this.removeListener = function(type, fn){
        if(typeof(__listeners[type]) !== u){
            for(var i=0, j=__listeners[type].length; i<j; ++i){
                if(typeof(fn) === f && __listeners[type][i] === fn){
                    __listeners[type].splice(i, 1);
                }
            }
            //At the end, we clear unused listeners array type
            for(var j=0; j<__listeners.length; ++j){
                if(__listeners[j].length < 1){
                    __listeners.splice(j, 1);
                }
            }
        }
    }
    this.dispatch = function(type, data){
        var f = __listeners[type];

        if(typeof(f) !== u){
            for(var i=0, l=f.length; i<l; ++i){
                var func = f[i](data);
                return func;
            }
        }else{
            return true;
        }
    }
    this.reset = function(){
         __listeners = new Array();
    }
}

/*
 *  Hide window event
 */
var visibilityChange;
if (typeof document.hidden !== 'undefined') {
    visibilityChange = 'visibilitychange';
}
else if (typeof document.mozHidden !== 'undefined') {
    visibilityChange = 'mozvisibilitychange';
}
else if (typeof document.msHidden !== 'undefined') {
    visibilityChange = 'msvisibilitychange';
}
else if (typeof document.webkitHidden !== 'undefined') {
    visibilityChange = 'webkitvisibilitychange';
}

document.addEventListener(visibilityChange, function(e) {
    if(Game == null) return false;

    if(Game.paused)
        Game.paused = false;
    else
        Game.paused = true;

    Input.keyDownsActives   = {};
    Input.mouseDownsActives = {};

    if(Game.getCurrentScene() != null){
        if(Game.getCurrentScene().gameobjects != null){
            // For each gameobject with PlayerBehavior -> clear keysDown array
            for(var i=0;i<Game.getCurrentScene().gameobjects.length;i++){
                var go = Game.getCurrentScene().gameobjects[i];
                if(go.behavior)
                    go.behavior.keysDown = [];
            }
        }
    }

    if(!document.hidden && Game.loader != null && !Game.loader.isLoaded) Game.paused = false;

}, false);


/**
 *  Detect errors
 */
window.onerror = function(error) {
    if(Game == null) return false;
    if(Game.errorView != null && !Game.errorView.enabled){
        log("Errors detected. Enter in error mode. See below \\/", "error");
        Game.errorView.enabled = true;
    }
};