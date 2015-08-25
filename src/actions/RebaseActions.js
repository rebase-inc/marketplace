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
    getCommentDetail: function(comment) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_COMMENT_DETAIL,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_COMMENT_DETAIL,
                response: RequestConstants.PENDING,
            });
        };
        Api.getCommentDetail(comment, responseAction, pendingAction);
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
