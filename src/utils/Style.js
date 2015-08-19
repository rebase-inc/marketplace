function handleScrollShadows(element) {
    var node = element.getDOMNode();
    if (node.scrollTop) { node.classList.add('top-scroll-shadow'); }
    else { node.classList.remove('top-scroll-shadow'); }
    if (node.scrollTop + node.offsetHeight == node.scrollHeight) { node.classList.remove('bottom-scroll-shadow'); }
    else { node.classList.add('bottom-scroll-shadow'); }
}

// Polyfill for Object.assign
//if (!Object.assign) {
    //Object.defineProperty(Object, 'assign', {
        //enumerable: false,
        //configurable: true,
        //writable: true,
        //value: function(target, firstSource) {
            //'use strict';
            //if (target === undefined || target === null) {
                //throw new TypeError('Cannot convert first argument to object');
            //}

            //var to = Object(target);
            //for (var i = 1; i < arguments.length; i++) {
                //var nextSource = arguments[i];
                //if (nextSource === undefined || nextSource === null) {
                    //continue;
                //}

                //var keysArray = Object.keys(Object(nextSource));
                //for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    //var nextKey = keysArray[nextIndex];
                    //var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    //if (desc !== undefined && desc.enumerable) {
                        //to[nextKey] = nextSource[nextKey];
                    //}
                //}
            //}
            //return to;
        //}
    //});
//}

// See vjeux's blog for the motivation behind this (inline CSS)
//function m() {
    //noFalsy = {}
    //for (var i = 0; i < arguments.length; ++i) {
        //if (arguments[i]) {
            //Object.assign(noFalsy, arguments[i]);
        //}
    //}
    //return noFalsy;
//}

module.exports = {
    handleScrollShadows: handleScrollShadows,
    //m: m
}
