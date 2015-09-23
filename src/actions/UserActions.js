var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    login: function(email, password) {
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGIN,
                status: status || RequestConstants.ERROR,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.LOGIN,
                status: RequestConstants.PENDING,
            });
        };
        Api.login(email, password, responseAction, pendingAction);
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
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_USER_DETAIL,
                status: status,
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
