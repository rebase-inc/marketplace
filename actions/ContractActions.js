import fetch from 'isomorphic-fetch';

import ActionConstants from '../constants/ActionConstants';
import { ERROR, PENDING, SUCCESS } from '../constants/RequestConstants';

function handleStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

export function getContracts() {
    return function(dispatch) {
        dispatch({ type: ActionConstants.GET_CONTRACTS, status: PENDING });
        return fetch('http://localhost:5000/contracts', { credentials: 'include' })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.GET_CONTRACTS, status: SUCCESS, response: json }))
            .catch(json => { console.warn(json); return dispatch({ type: ActionConstants.GET_CONTRACTS, status: ERROR, response: json }) });
    };
}

//module.exports = {
    //getContractData: function() {
        //function responseAction(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_CONTRACT_DATA,
                //status: status,
                //response: response
            //});
        //};
        //function pendingAction() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_CONTRACT_DATA,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.getContractData(responseAction, pendingAction);
    //},
    //selectContract: function(contractID) {
        //Dispatcher.handleRequestAction({
            //type: ActionConstants.SELECT_CONTRACT,
            //contractID: contractID,
        //});
    //},
    //submitWork: function(user, contract, reason) {
        //var responseAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.SUBMIT_WORK,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.SUBMIT_WORK,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.submitWork(user, contract, reason, responseAction, pendingAction);
    //},
    //disputeWork: function(user, work, reason) {
        //var responseAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.DISPUTE_WORK,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.DISPUTE_WORK,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.disputeWork(user, work, reason, responseAction, pendingAction);
    //},
    //markWorkComplete: function(user, work, comment) {
        //var responseAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_COMPLETE,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_COMPLETE,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.markWorkComplete(user, work, comment, responseAction, pendingAction);
    //},
    //markWorkBlocked: function(user, work, reason) {
        //var responseAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_BLOCKED,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_BLOCKED,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.markWorkBlocked(user, work, reason, responseAction, pendingAction);
    //},
    //markWorkUnblocked: function(user, work, reason) {
        //var responseAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_UNBLOCKED,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.MARK_WORK_UNBLOCKED,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.markWorkUnblocked(user, work, reason, responseAction, pendingAction);
    //},
//};
