import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getAuctions() {
    return dispatchedRequest('GET', '/auctions', ActionConstants.GET_AUCTIONS);
}

export function approveNomination(auction, nomination) {
    const url = '/nominations/' + nomination.contractor.id + '/' + nomination.ticket_set.id;
    // The nomination object is in the data just for the pending case in the reducer
    const data = { auction: { id: auction.id }, nomination: nomination };
    return dispatchedRequest('PUT', url, ActionConstants.APPROVE_NOMINATION, data);
}

export function bidOnAuction(user, auction, price) {
    const url = '/auctions/' + auction.id + '/bid_events';
    // TODO: Refactor API so bidding on auction doesn't require user object
    const data = {
        bid: {
            work_offers: [{
                price: price,
                ticket_snapshot: { id: auction.ticket_set.bid_limits[0].ticket_snapshot.id },
                contractor: { id: user.current_role.id },
            }],
            contractor: { id: user.current_role.id }, // oh god this is terrible
            auction: { id: auction.id },
        }
    };
    return dispatchedRequest('POST', url, ActionConstants.BID_ON_AUCTION, data);
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
