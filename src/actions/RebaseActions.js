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
    commentOnIssue: function(user, ticket, text) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.NEW_COMMENT,
            user: user,
            ticket: ticket,
            text: text
        });
    }
};
