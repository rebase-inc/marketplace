var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var RequestConstants = require('../constants/RequestConstants');

var Action = {
    create: function (typeConstant, apiFunction) {
        return function(...args) {
            function responseAction(response, status) {
                Dispatcher.handleRequestAction({
                    type: typeConstant,
                    status: status,
                    response: response,
                    args: args
                });
            };
            function pendingAction() {
                Dispatcher.handleRequestAction({
                    type: typeConstant,
                    status: RequestConstants.PENDING,
                });
            };
            apiFunction(...args, responseAction, pendingAction);
        };
    },
};

module.exports = Action;
