var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RequestConstants = require('../constants/RequestConstants');
var _ = require('underscore');

function defaultHandler(successHandler, pendingAndErrorHandler, action) {
    switch (action.status) {
        case RequestConstants.PENDING:
        case RequestConstants.TIMEOUT:
        case RequestConstants.ERROR:
        case null:
        pendingAndErrorHandler(action);
        break;
        default: successHandler(action);
    }
}

var Store = {

    defaultPendingAndErrorHandler: function(action) {
        switch (action.status) {
            case RequestConstants.PENDING: this.loading = true; break;
            case RequestConstants.TIMEOUT: this.loading = false; console.warn(action.response); break;
            case RequestConstants.ERROR: this.loading = false; console.warn(action.response); break;
            case null: this.loading = false; console.warn('Undefined data!'); break;
            case undefined: this.loading = false; console.warn('Undefined data!'); break;
        }
    },

    newStore: function (_getState) {
        return _.extend({}, EventEmitter.prototype, {
            getState: _getState,
            emitChange: function() { this.emit('change'); },
            addChangeListener: function(callback) { this.on('change', callback); },
            removeChangeListener: function(callback) { this.removeListener('change', callback); }
        });
    },

    registerDispatcher: function (store, typeConstant, successHandler, pendingAndErrorHandler) {
        Dispatcher.register(function(payload) {
            var action = payload.action;
            switch(action.type) {
                case typeConstant: defaultHandler(successHandler, pendingAndErrorHandler, action); break;
                default: return true;
            }

            // If action was responded to, emit change event
            store.emitChange();
            return true;
        });
    }
};

module.exports = Store;
