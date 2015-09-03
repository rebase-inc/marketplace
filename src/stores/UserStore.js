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
var _currentUser = null; // don't really want cookies to work right now
var _loggedIn = !!_currentUser;
var _currentView = null;
var _currentRole = null;
var _loading = false;

var UserStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            currentUser: _currentUser,
            loggedIn: _loggedIn,
            currentView: _currentView,
            currentRole: _currentRole,
            loading: _loading,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.LOGIN: handleLogin(action.response); break;
        case ActionConstants.SELECT_VIEW: handleSelectView(action.viewType); break;
        case ActionConstants.SELECT_ROLE: handleSelectRole(action.roleID); break;
        case ActionConstants.GET_USER_DETAIL: handleLogin(action.response); break;
        default: return true;
    }

    // If action was responded to, emit change event
    UserStore.emitChange();
    return true;
});

function handleLogin(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _currentUser = data.user;
            _currentRole = _currentUser.roles[0];
            _currentRole.display_name = _currentRole.type == 'manager' ? _currentRole.organization.name + '/' + _currentRole.organization.projects[0].name : 'Contractor View';
            switch (_currentRole.type) {
                case 'contractor': _currentView = ContractorViews[ViewTypes.OFFERED]; break;
                case 'manager': _currentView = ManagerViews[ViewTypes.NEW]; break;
            }
            _loggedIn = !!_currentUser;
            Cookies.set('user', JSON.stringify(_currentUser), 1);
    }
}

function handleSelectView(viewType) {
    switch(_currentRole.type) {
        case 'contractor': _currentView = ContractorViews[viewType]; break;
        case 'manager': _currentView = ManagerViews[viewType]; break;
    }
}

function handleSelectRole(roleID) {
    _currentRole = _currentUser.roles.filter(role => role.id == roleID)[0] || _currentRole;
}

function handleUserDetail(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allAuctions.forEach(auction => auction.ticket.comments.forEach(comment => { comment = comment.id == data.comment.id ? data.comment : comment }));
            break;
    }
}

module.exports = UserStore;
