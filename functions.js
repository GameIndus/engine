function loadJSON(path, success, error){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success){
                    if(xhr.responseText == "") xhr.responseText = "{}";
                    success(JSON.parse(xhr.responseText));
                }
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function log(message, type){
    if(!Config.debugMode) return false;

    if(type!==undefined&&type=="error"){
        console.error("[GIEngine] "+message);
    }else{
        console.log("[GIEngine] "+message);
    }
}

function clone(obj) {
    if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}

function clone_object(o){
    var n=Object.create(
        Object.getPrototypeOf(o),
        Object.getOwnPropertyNames(o).reduce(
            function(prev,cur){
                prev[cur]=Object.getOwnPropertyDescriptor(o,cur);
                return prev;
            },
            {}
        )
    );
    if(!Object.isExtensible(o)){Object.preventExtensions(n);}
    if(Object.isSealed(o)){Object.seal(n);}
    if(Object.isFrozen(o)){Object.freeze(n);}

    return n;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getIndexFromXY(x, y, sizeH){
    return (parseInt(y) * parseInt(sizeH) + parseInt(x));
}

function formatFilename(str){
    if(str==null) return "";
    return str.toString().split(" ").join("-").toLowerCase();
}

function lerp(value1, value2, n){
    n = n < 0 ? 0 : n;
    n = n > 1 ? 1 : n;

    return value1 + ((value2 - value1) * n);
}

Array.prototype.clone = function() {
    return this.slice(0);
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

var cloneObject = function() {
    var newObj = (this instanceof Array) ? [] : {};
    for (var i in this) {
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i].clone();
        }
        else
        {
            newObj[i] = this[i];
        }
    }
    return newObj;
}; 

Object.defineProperty( Object.prototype, "clone", {value: cloneObject, enumerable: false});