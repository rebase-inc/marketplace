// External
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

// Utils
var Cookies = require('../utils/Cookies');

// Constants
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewTypes = require('../constants/viewconstants').ViewTypes;
var ContractorViews = require('../constants/viewconstants').ContractorViews;
var ManagerViews = require('../constants/viewconstants').ManagerViews;

// Actions
var UserActions = require('../actions/UserActions');

var _userCookie = Cookies.get('user');
var _currentUser = !!_userCookie ? JSON.parse(_userCookie) : null;
var _loggedIn = !!_currentUser;
var _currentView = null;
var _currentRole = null;

function persistLoginState(data) {
    _currentUser = data.user;
    _currentRole = _currentUser.roles[0];
    _currentRole.display_name = _currentRole.organization + '/' + _currentRole.project;
    switch (_currentRole.type) {
        case 'contractor': _currentView = ContractorViews[ViewTypes.OFFERED]; break;
        case 'manager': _currentView = ManagerViews[ViewTypes.NEW]; break;
    }
    _loggedIn = true;
    Cookies.set('user', JSON.stringify(_currentUser), 1);
}

var UserStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            currentUser: _currentUser,
            loggedIn: _loggedIn,
            currentView: _currentView,
            currentRole: _currentRole,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.LOGIN:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending login!'); break;
                case RequestConstants.ERROR: console.log('Error logging in!'); break;
                case RequestConstants.NOT_LOGGED_IN: console.log('Not authorized!'); break;
                default: persistLoginState(action.response); break;
            } break;
        case ActionConstants.SELECT_VIEW:
            switch(_currentRole.type) {
                case 'contractor': _currentView = ContractorViews[action.viewType]; break;
                case 'manager': _currentView = ManagerView[action.viewType]; break;
            } break;
        case ActionConstants.SELECT_ROLE:
            var newRole = _currentUser.roles.filter(role => role.id == action.roleID)[0];
            if (newRole) { _currentRole = newRole; }
            else { console.warn('Invalid roleID given: ', action.roleID); }
            break;
        case ActionConstants.GET_USER_DETAIL:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending user details!'); break;
                default: persistLoginState(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    UserStore.emitChange();
    return true;
});

module.exports = UserStore;
