var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getAuctionData: function() {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DATA,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DATA,
                response: RequestConstants.PENDING,
            });
        };
        Api.getAuctionData(responseAction, pendingAction);
    },
    getTicketData: function() {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: RequestConstants.PENDING,
            });
        };
        Api.getTicketData(responseAction, pendingAction);
    },
    commentOnTicket: function(user, ticket, text) {
        Dispatcher.handleAction({
            type: ActionConstants.ADD_COMMENT_TO_TICKET,
            user: user,
            ticket: ticket,
            text: text
        });
    },
    commentOnAuction: function(user, auction, text) {
        Dispatcher.handleAction({
            type: ActionConstants.ADD_COMMENT_TO_AUCTION,
            user: user,
            auction: auction,
            text: text
        });
    },
};
