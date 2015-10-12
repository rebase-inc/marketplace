var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');
var _ = require('underscore');

function userResponseHandler(initialActionType, actionTypes, pendingAction, userResponse, status) {
    var actionType = null;
    var responseHandler = function(actionType, response, status) {
        Dispatcher.handleRequestAction({
            type: actionType,
            status: status || RequestConstants.ERROR,
            response: _.extend(response, {user: userResponse.user}),
        });
    };
    var user = userResponse.user;
    actionType = actionTypes.get(user.current_role.type);
    switch(user.current_role.type) {
        case 'manager': {
            Api.getManagers(responseHandler.bind(null, actionType), pendingAction);
        } break;
        case 'contractor': {
            Api.getContractors(responseHandler.bind(null, actionType), pendingAction);
        } break;
        case  'owner': {
            console.log('TODO: implement owner store');
            //Api.getOwners(responseHandler.bind(null, actionType), pendingAction);
        } break;
        default: {
            Dispatcher.handleRequestAction({
                type: initialActionType,
                status: RequestConstants.ERROR,
                response: userResponse
            });
        }
    }
};

var loginActionTypes = new Map([
    ['manager',     ActionConstants.LOGIN_AS_MANAGER],
    ['contractor',  ActionConstants.LOGIN_AS_CONTRACTOR],
    ['owner',       ActionConstants.LOGIN_AS_OWNER],
]);

var getUserDetailActionTypes = new Map([
    ['manager',     ActionConstants.GET_USER_DETAIL_AS_MANAGER],
    ['contractor',  ActionConstants.GET_USER_DETAIL_AS_CONTRACTOR],
    ['owner',       ActionConstants.GET_USER_DETAIL_AS_OWNER],
]);

module.exports = {
    login: function(email, password) {
        var actionType = ActionConstants.LOGIN;
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: actionType,
                status: RequestConstants.PENDING,
            });
        };
        Api.login(email, password, userResponseHandler.bind(null, actionType, loginActionTypes, pendingAction), pendingAction);
    },
    logout: function() {
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGOUT,
                status: status,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGOUT,
                response: RequestConstants.PENDING,
            });
        };
        Api.logout(responseAction, pendingAction);
    },
    authenticateGithub: function() {
        function responseAction(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.AUTHENTICATE_GITHUB,
                status: status,
                response: response
            });
        };
        function pendingAction() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.AUTHENTICATE_GITHUB,
                status: RequestConstants.PENDING,
            });
        };
        Api.authenticateGithub(responseAction, pendingAction);
    },
    getUserDetail: function(userID) {
        var actionType = ActionConstants.GET_USER_DETAIL;
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: actionType,
                status: RequestConstants.PENDING,
            });
        };
        Api.getUserDetail(userID, userResponseHandler.bind(null, actionType, getUserDetailActionTypes, pendingAction), pendingAction);
    },
    updateUserSettings: function(user) {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.UPDATE_USER_SETTINGS,
                status: status,
                response: response
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.UPDATE_USER_SETTINGS,
                status: RequestConstants.PENDING,
            });
        };
        Api.updateUserSettings(user, responseHandler, pendingHandler);
    },
    updateProfilePhoto: function(file) {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.UPDATE_PROFILE_PHOTO,
                status: status,
                response: response
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.UPDATE_PROFILE_PHOTO,
                status: RequestConstants.PENDING,
            });
        };
        Api.updateProfilePhoto(file, responseHandler, pendingHandler);
    },
    selectRole: function(user, role_id) {
        // we need to make 2 ajax calls, the 2nd one made if the response to the 1st one is successful.
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.SELECT_ROLE,
                status: RequestConstants.PENDING,
            });
        };
        
        function usersResponseHandler(usersResponse, usersStatus) {
            function ticketsResponseHandler(ticketsResponse, ticketsStatus) {
                Dispatcher.handleRequestAction({
                    type: ActionConstants.SELECT_ROLE,
                    status: status,
                    response: {
                        user: usersResponse.user,
                        tickets: ticketsResponse.tickets
                    }
                });
            }
            Api.getTicketData(ticketsResponseHandler, pendingHandler);
        };
        Api.updateUserSettings({ id: user.id, current_role: { id: role_id } }, usersResponseHandler, pendingHandler);
        
    },
    selectView: function(viewType) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_VIEW,
            viewType: viewType,
        });
    },
};
