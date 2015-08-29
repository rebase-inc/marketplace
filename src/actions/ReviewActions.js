var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getReviewData: function() {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_REVIEW_DATA,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_REVIEW_DATA,
                response: RequestConstants.PENDING,
            });
        };
        Api.getReviewData(responseAction, pendingAction);
    },
    selectReview: function(reviewID) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_REVIEW,
            reviewID: reviewID,
        });
    },
};
