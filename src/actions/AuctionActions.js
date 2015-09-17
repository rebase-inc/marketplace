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
    getAuctionDetail: function(id) {
        !id ? console.warn('No auction id provided!') : null;
        function responseHandler(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DETAIL,
                response: response
            });
        };
        function pendingHandler(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DETAIL,
                response: RequestConstants.PENDING,
            });
        };
        Api.getAuctionDetail(id, responseHandler, pendingHandler);
    },
    bidOnAuction: function(user, auction, price) {
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
        Api.bidOnAuction(user, auction, price, responseAction, pendingAction);
    },
    selectAuction: function(auctionID) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_AUCTION,
            auctionID: auctionID,
        });
    },
};
