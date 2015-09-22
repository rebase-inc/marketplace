var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getContractData: function() {
        function responseAction(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_CONTRACT_DATA,
                status: status,
                response: response
            });
        };
        function pendingAction() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_CONTRACT_DATA,
                status: RequestConstants.PENDING,
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
    submitWork: function(user, contract, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.SUBMIT_WORK,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.SUBMIT_WORK,
                status: RequestConstants.PENDING,
            });
        };
        Api.submitWork(user, contract, reason, responseAction, pendingAction);
    },
    disputeWork: function(user, work, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.DISPUTE_WORK,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.DISPUTE_WORK,
                status: RequestConstants.PENDING,
            });
        };
        Api.disputeWork(user, work, reason, responseAction, pendingAction);
    },
    markWorkComplete: function(user, work, comment) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_COMPLETE,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_COMPLETE,
                status: RequestConstants.PENDING,
            });
        };
        Api.markWorkComplete(user, work, comment, responseAction, pendingAction);
    },
    markWorkBlocked: function(user, work, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_BLOCKED,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_BLOCKED,
                status: RequestConstants.PENDING,
            });
        };
        Api.markWorkBlocked(user, work, reason, responseAction, pendingAction);
    },
    markWorkUnblocked: function(user, work, reason) {
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_UNBLOCKED,
                response: response
            });
        };
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.MARK_WORK_UNBLOCKED,
                status: RequestConstants.PENDING,
            });
        };
        Api.markWorkUnblocked(user, work, reason, responseAction, pendingAction);
    },
};
