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
var ManagerActions = require('../actions/ManagerActions');

// Stores
var ManagerStore = require('../stores/ManagerStore');
var ContractorStore = require('../stores/ContractorStore');

var _userCookie = Cookies.get('user');

var _userState = {
    currentUser: null,
    loggedIn: null,
    currentView: null,
    currentRole: null,
    currentUserManagerRoles: [],
    currentUserContractorRoles: [],
    loading: false,
    error: null,
};

!!_userCookie ? handleLogin({response: {user: JSON.parse(_userCookie)}}) : null;
!!_userState.currentUser ? UserActions.getUserDetail(_userState.currentUser.id) : null;

var UserStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return _userState;
    },
    emitChange: function(actionType) { this.emit('change', actionType); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); },
});

function updateRoles(roleStore, allRolesField, rolesField) {
    var state = roleStore.getState();
    
    if (state.loading) {
        return;
    }
    _userState[rolesField] = [];
    state[allRolesField].forEach(function (role) {
        if (role.user.id == _userState.currentUser.id) {
            _userState[rolesField].push(role);
        }
        if (role.id == _userState.currentRole.id) {
            _userState.currentRole = role;
        }
    });
    UserStore.emitChange();
};

ManagerStore.addChangeListener(updateRoles.bind(null, ManagerStore, 'allManagers', 'currentUserManagerRoles'));
ContractorStore.addChangeListener(updateRoles.bind(null, ContractorStore, 'allContractors', 'currentUserContractorRoles'));

UserStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.LOGIN: handleLogin(action); break;
        case ActionConstants.LOGOUT: handleLogout(action); break;
        case ActionConstants.CREATE_AUCTION: handleCreateAuction(action); break;
        case ActionConstants.SELECT_VIEW: handleSelectView(action.viewType); break;
        case ActionConstants.SELECT_ROLE: updateUserDetail(action); break;
        case ActionConstants.GET_USER_DETAIL: updateUserDetail(action); break;
        case ActionConstants.UPDATE_PROFILE_PHOTO: updateUserDetail(action); break;
        case ActionConstants.UPDATE_USER_SETTINGS: updateUserDetail(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    UserStore.emitChange(action.type);
    return true;
});

function handleCreateAuction(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _userState.loading = true; break;
        case RequestConstants.TIMEOUT: _userState.loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _userState.loading = false; console.warn(action.response); break;
        case null: _userState.loading = false; console.warn('Undefined data!');
        case RequestConstants.SUCCESS:
            _userState.loading = false;
            switch(_userState.currentRole.type) {
                case 'contractor': console.warn('Invalid action CREATE_AUCTION for contractor role'); break;
                case 'manager': _userState.currentView = ManagerViews[ViewTypes.OFFERED]; break;
                case 'owner': console.warn('Invalid action CREATE_AUCTION for owner role'); break;
            }
            break;
        default:
            console.log(action);
            throw 'Invalid status from action CREATE_AUCTION: ' + action.status;
    }
}

function updateUserDetail(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _userState.loading = true; break;
        case RequestConstants.TIMEOUT: _userState.loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _userState.loading = false; console.warn(action.response); break;
        case null: _userState.loading = false; console.warn('Undefined data!');
        default:
            _userState.loading = false;
            _userState.currentUser = action.response.user;
            Cookies.set('user', JSON.stringify(_userState.currentUser), 1);
    }
}

function handleLogin(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _userState.loading = true; break;
        case RequestConstants.TIMEOUT: _userState.loading = false; _userState.error='Timeout'; console.warn('Timeout during login.'); break;
        case RequestConstants.ERROR: {
            _userState.loading = false;
            switch (action.response.status) {
                case 401: {
                    _userState.error = 'Wrong credentials.';
                    console.log(action.response.responseJSON);
                } break;
                default: {
                    _userState.error = action.response.responseText;
                    console.log(action.response);
                }
            }

        } break;
        case null: _userState.loading = false; console.warn('Undefined data!');
        default:
            _userState.loading = false;
            _userState.currentUser = action.response.user;
            _userState.currentRole = _userState.currentUser.current_role;
            if (_userState.currentRole.type == 'manager' ) {
                _userState.currentRole.display_name = 'Manager View (loading)';
            } else {
                _userState.currentRole.display_name = 'Contractor View';
            }
            switch (_userState.currentRole.type) {
                case 'contractor': _userState.currentView = ContractorViews[ViewTypes.OFFERED]; break;
                case 'manager': _userState.currentView = ManagerViews[ViewTypes.NEW]; break;
                case 'owner': _userState.currentView = ManagerViews[ViewTypes.NEW]; break;
            }
            _userState.loggedIn = !!_userState.currentUser;
            Cookies.set('user', JSON.stringify(_userState.currentUser), 1);
    }
}

function handleLogout(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _userState.loading = true; break;
        case RequestConstants.TIMEOUT: _userState.loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _userState.loading = false; console.warn(action.response); break;
        case null: _userState.loading = false; console.warn('Undefined data!');
        default:
            _userState.loading = false;
            _userState.currentUser = null;
            _userState.currentRole = null;
            _userState.loggedIn = null;
            _userState.error = null;
            Cookies.erase('user');
    }
}

function handleSelectView(viewType) {
    if (!ViewTypes[viewType]) {
        console.warn("Invalid view selected", viewType);
        return;
    }
    switch(_userState.currentRole.type) {
        case 'contractor': _userState.currentView = ContractorViews[viewType] || {type: viewType}; break;
        case 'manager': _userState.currentView = ManagerViews[viewType] || {type: viewType}; break;
        case 'owner': _userState.currentView = ManagerViews[viewType] || {type: viewType}; break;
    }
}

module.exports = UserStore;
