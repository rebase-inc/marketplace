var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
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
};
