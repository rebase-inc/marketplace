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

export function getAuctions() {
    return function(dispatch) {
        dispatch({ type: ActionConstants.GET_AUCTIONS, status: PENDING });
        return fetch('http://localhost:5000/auctions', { credentials: 'include' })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.GET_AUCTIONS, status: SUCCESS, response: json }))
            .catch(json => { console.warn('ERROR: ', json); return dispatch({ type: ActionConstants.GET_AUCTIONS, status: ERROR, response: json }) });
    };
}

export function approveNomination(auction, nomination) {
    return function(dispatch) {
        dispatch({ type: ActionConstants.APPROVE_NOMINATION, status: PENDING, response: { auction: auction, nomination: nomination } });
        let data = { auction: { id: auction.id } };
        return fetch('http://localhost:5000/nominations/' + nomination.contractor.id + '/' + nomination.ticket_set.id, {
                method: 'PUT',
                credentials: 'include', // TEMPORARY CORS HACK
                headers: { 'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify(data) })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.APPROVE_NOMINATION, status: SUCCESS, response: Object.assign({auction}, json) }))
            .catch(json => dispatch({ type: ActionConstants.APPROVE_NOMINATION, status: ERROR, response: json }));
    };
}

export function selectAuction(auctionId) {
    return {
        type: ActionConstants.SELECT_AUCTION,
        response: { auctionId: auctionId },
        status: SUCCESS
    }
}

//module.exports = {
    //createAuction: function(ticket, max_price) {
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.CREATE_AUCTION,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.CREATE_AUCTION,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.createAuction(ticket, max_price, responseHandler, pendingHandler);
    //},
    //getAuctionData: function() {
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_AUCTION_DATA,
                //status: status,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_AUCTION_DATA,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.getAuctionData(responseAction, pendingAction);
    //},
    //getAuctionDetail: function(id) {
        //!id ? console.warn('No auction id provided!') : null;
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_AUCTION_DETAIL,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_AUCTION_DETAIL,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.getAuctionDetail(id, responseHandler, pendingHandler);
    //},
    //bidOnAuction: function(user, auction, price) {
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.BID_ON_AUCTION,
                //status: status,
                //response: response
            //});
        //};
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.BID_ON_AUCTION,
                //response: {auction: auction},
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.bidOnAuction(user, auction, price, responseAction, pendingAction);
    //},
    //selectAuction: function(auctionID) {
        //Dispatcher.handleRequestAction({
            //type: ActionConstants.SELECT_AUCTION,
            //auctionID: auctionID,
        //});
    //},
//};
