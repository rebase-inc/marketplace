var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    createAuction: function(ticket, max_price) {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.CREATE_AUCTION,
                status: status,
                response: response
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.CREATE_AUCTION,
                status: RequestConstants.PENDING,
            });
        };
        Api.createAuction(ticket, max_price, responseHandler, pendingHandler);
    },
    getAuctionData: function() {
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DATA,
                status: status,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DATA,
                status: RequestConstants.PENDING,
            });
        };
        Api.getAuctionData(responseAction, pendingAction);
    },
    getAuctionDetail: function(id) {
        !id ? console.warn('No auction id provided!') : null;
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DETAIL,
                status: status,
                response: response
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_AUCTION_DETAIL,
                status: RequestConstants.PENDING,
            });
        };
        Api.getAuctionDetail(id, responseHandler, pendingHandler);
    },
    bidOnAuction: function(user, auction, price) {
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.BID_ON_AUCTION,
                status: status,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.BID_ON_AUCTION,
                status: RequestConstants.PENDING,
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
