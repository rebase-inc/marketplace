var handleScrollShadows = function(element) {
    var node = element.getDOMNode();
    if (node.scrollTop) { node.classList.add('top-scroll-shadow'); }
    else { node.classList.remove('top-scroll-shadow'); }
    if (node.scrollTop + node.offsetHeight == node.scrollHeight) { node.classList.remove('bottom-scroll-shadow'); }
    else { node.classList.add('bottom-scroll-shadow'); }
}

module.exports = { handleScrollShadows: handleScrollShadows }
