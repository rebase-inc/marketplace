var ReactDOM = require('react-dom');

function handleScrollShadows(element) {
    var node = ReactDOM.findDOMNode(element);
    if (node.scrollTop) { node.classList.add('top-scroll-shadow'); }
    else { node.classList.remove('top-scroll-shadow'); }
    if (node.scrollTop + node.offsetHeight == node.scrollHeight) { node.classList.remove('bottom-scroll-shadow'); }
    else { node.classList.add('bottom-scroll-shadow'); }
}

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
