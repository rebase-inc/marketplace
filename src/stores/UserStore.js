var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var _email = null;
var _loggedIn = true;

function persistLoginState(userData) {
    _loggedIn = true;
}

var UserStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            email: _email,
            loggedIn: _loggedIn,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.LOGIN:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending login!'); break;
                case RequestConstants.ERROR: console.log('Error logging in!'); break;
                case RequestConstants.NOT_LOGGED_IN: console.log('Not authorized!'); break;
                default: persistLoginState(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    UserStore.emitChange();
    return true;
});

module.exports = UserStore;
