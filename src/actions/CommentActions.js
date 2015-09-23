var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getCommentDetail: function(comment) {
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_COMMENT_DETAIL,
                status: status,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_COMMENT_DETAIL,
                status: RequestConstants.PENDING,
            });
        };
        Api.getCommentDetail(comment, responseAction, pendingAction);
    },
    commentOnTicket: function(user, ticket, text) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ADD_COMMENT_TO_TICKET,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ADD_COMMENT_TO_TICKET,
                response: RequestConstants.PENDING,
            });
        };
        Api.commentOnTicket(user, ticket, text, responseAction, pendingAction);
    },
};
