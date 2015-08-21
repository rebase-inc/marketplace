var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var Api = require('../utils/Api');

module.exports = {
    getAuctionData: function() {
        Api.getAuctionData(function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DATA,
                response: response
            });
        });
    },
    receiveAllTickets: function(allTickets) {
        Dispatcher.handleAction({
            type: ActionConstants.GET_ALL_TICKETS,
            allTickets: allTickets
        });
    },
    receiveAvailableAuctions: function(availableAuctions) {
        Dispatcher.handleAction({
            type: ActionConstants.GET_AVAILABLE_AUCTIONS,
            availableAuctions: availableAuctions
        });
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
