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
var ViewTypes = require('../constants/ViewConstants').ViewTypes;
var ContractorViews = require('../constants/ViewConstants').ContractorViews;
var ManagerViews = require('../constants/ViewConstants').ManagerViews;

// Actions
var UserActions = require('../actions/UserActions');

var _userCookie = Cookies.get('user');
var _currentUser = null;
var _loggedIn = null;
var _currentView = null;
var _currentRole = null;
var _loading = false;
var _error = null;

!!_userCookie ? handleLogin({response: {user: JSON.parse(_userCookie)}}) : null;
!!_currentUser ? UserActions.getUserDetail(_currentUser.id) : null;

var UserStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            currentUser: _currentUser,
            loggedIn: _loggedIn,
            currentView: _currentView,
            currentRole: _currentRole,
            loading: _loading,
            error: _error,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

UserStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.LOGIN: handleLogin(action); break;
        case ActionConstants.LOGOUT: handleLogout(action); break;
        case ActionConstants.SELECT_VIEW: handleSelectView(action.viewType); break;
        case ActionConstants.SELECT_ROLE: handleSelectRole(action.roleID); break;
        case ActionConstants.GET_USER_DETAIL: updateUserDetail(action); break;
        case ActionConstants.UPDATE_PROFILE_PHOTO: updateUserDetail(action); break;
        case ActionConstants.UPDATE_USER_SETTINGS: updateUserDetail(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    UserStore.emitChange();
    return true;
});

function updateUserDetail(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _currentUser = action.response.user;
            Cookies.set('user', JSON.stringify(_currentUser), 1);
    }
}

function handleLogin(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; _error='Timeout'; console.warn('Timeout during login.'); break;
        case RequestConstants.ERROR: {
            _loading = false;
            switch (action.response.status) {
                case 401: {
                    _error = 'Wrong credentials.';
                    console.log(action.response.responseJSON);
                } break;
                default: {
                    _error = action.response.responseText;
                    console.log(action.response);
                }
            }
            
        } break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _currentUser = action.response.user;
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

function handleLogout(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _currentUser = null;
            _currentRole = null;
            _loggedIn = null;
            _error = null;
            Cookies.erase('user');
    }
}

function handleSelectView(viewType) {
    if (!ViewTypes[viewType]) {
        console.warn("Invalid view selected", viewType);
        return;
    }
    switch(_currentRole.type) {
        case 'contractor': _currentView = ContractorViews[viewType] || {type: viewType}; break;
        case 'manager': _currentView = ManagerViews[viewType] || {type: viewType}; break;
    }
}

function handleSelectRole(roleID) {
    _currentRole = _currentUser.roles.filter(role => role.id == roleID)[0] || _currentRole;
}

module.exports = UserStore;
