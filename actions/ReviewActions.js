//var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
//var ActionConstants = require('../constants/ActionConstants');
//var RequestConstants = require('../constants/RequestConstants');
//var Api = require('../utils/Api');

//module.exports = {
    //getReviewData: function() {
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_REVIEW_DATA,
                //status: status,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_REVIEW_DATA,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.getReviewData(responseAction, pendingAction);
    //},
    //selectReview: function(reviewID) {
        //Dispatcher.handleRequestAction({
            //type: ActionConstants.SELECT_REVIEW,
            //reviewID: reviewID,
        //});
    //},
//};
