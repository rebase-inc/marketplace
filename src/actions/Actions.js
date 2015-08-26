var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getContractData: function() {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_CONTRACT_DATA,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_CONTRACT_DATA,
                response: RequestConstants.PENDING,
            });
        };
        Api.getContractData(responseAction, pendingAction);
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
