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
    selectContract: function(contractID) {
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_CONTRACT,
            contractID: contractID,
        });
    },
    markComplete: function(user, contract, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_COMPLETE,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_COMPLETE,
                response: RequestConstants.PENDING,
            });
        };
        Api.markContractComplete(user, contract, reason, responseAction, pendingAction);
    },
    markBlocked: function(user, contract, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_BLOCKED,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_BLOCKED,
                response: RequestConstants.PENDING,
            });
        };
        Api.markContractBlocked(user, contract, reason, responseAction, pendingAction);
    },
    markUnblocked: function(user, contract, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_UNBLOCKED,
                response: response
            });
        };
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_CONTRACT_UNBLOCKED,
                response: RequestConstants.PENDING,
            });
        };
        Api.markContractUnblocked(user, contract, reason, responseAction, pendingAction);
    },
};
