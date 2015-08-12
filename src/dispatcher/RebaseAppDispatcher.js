var Dispatcher = require('flux').Dispatcher;

// Convenience method to handle dispatch requests
Dispatcher.handleAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
}

module.exports = new Dispatcher();
