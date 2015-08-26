var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getTicketData: function() {
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: RequestConstants.PENDING,
            });
        };
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: response
            });
        };
        Api.getTicketData(responseAction, pendingAction);
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