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
};
