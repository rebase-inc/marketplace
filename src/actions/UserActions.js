var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');
var _ = require('underscore');

module.exports = {
    login: function(email, password) {
        let actionType = ActionConstants.LOGIN;
        let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
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
        var actionType = ActionConstants.GET_USER_DETAIL;
        let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
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
    selectRole: function(user, role_id) {
        let actionType = ActionConstants.SELECT_ROLE;
        let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        Api.updateUserSettings({ id: user.id, current_role: { id: role_id } }, responseAction, pendingAction);
    },
    selectView: function(viewType) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_VIEW,
            viewType: viewType,
        });
    },
};
