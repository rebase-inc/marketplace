var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    login: function(email, password) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGIN,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGIN,
                response: RequestConstants.PENDING,
            });
        };
        Api.login(email, password, responseAction, pendingAction);
    },
    logout: function() {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGOUT,
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
        function responseAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.AUTHENTICATE_GITHUB,
                response: response
            });
        };
        function pendingAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.AUTHENTICATE_GITHUB,
                response: RequestConstants.PENDING,
            });
        };
        Api.authenticateGithub(responseAction, pendingAction);
    },
    getUserDetail: function(userID) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_USER_DETAIL,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_USER_DETAIL,
                response: RequestConstants.PENDING,
            });
        };
        Api.getUserDetail(userID, responseAction, pendingAction);
    },
    selectRole: function(roleID) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_ROLE,
            roleID: roleID,
        });
    },
    selectView: function(viewType) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_VIEW,
            viewType: viewType,
        });
    },
};
