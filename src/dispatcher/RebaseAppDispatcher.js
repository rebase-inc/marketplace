var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
AppDispatcher.handleAction = function(action) {
    if (!action.type) {
        throw "No action type provided!"
    }
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
}

// Convenience method to handle dispatch requests
AppDispatcher.handleRequestAction = function(action) {
    if (!action.type) { throw 'No action type provided!' }
    this.dispatch({
        source: 'REQUEST_ACTION',
        action: action,
    });
}

module.exports = AppDispatcher;
