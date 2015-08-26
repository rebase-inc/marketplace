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
