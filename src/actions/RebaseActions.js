var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');

module.exports = {
    receiveAllTickets: function(allTickets) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.GET_ALL_TICKETS,
            allTickets: allTickets
        });
    },
    receiveAvailableAuctions: function(availableAuctions) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.GET_AVAILABLE_AUCTIONS,
            availableAuctions: availableAuctions
        });
    },
    commentOnTicket: function(user, ticket, text) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.ADD_COMMENT_TO_TICKET,
            user: user,
            ticket: ticket,
            text: text
        });
    },
    commentOnAuction: function(user, auction, text) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.ADD_COMMENT_TO_AUCTION,
            user: user,
            auction: auction,
            text: text
        });
    },
};
