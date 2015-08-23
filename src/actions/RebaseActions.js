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
    commentOnAuction: function(user, auction, text) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ADD_COMMENT_TO_AUCTION,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ADD_COMMENT_TO_AUCTION,
                response: RequestConstants.PENDING,
            });
        };
        Api.commentOnAuction(user, auction, text, responseAction, pendingAction);
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
    bidOnAuction: function(user, ticket, price) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.BID_ON_AUCTION,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.BID_ON_AUCTION,
                response: RequestConstants.PENDING,
            });
        };
        Api.bidOnAuction(user, ticket, price, responseAction, pendingAction);
    },
};
