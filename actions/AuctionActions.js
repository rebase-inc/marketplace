import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';
import { BID_MODAL } from '../constants/ModalConstants';

export function getAuctions() {
    return (dispatch, getState) => (!!getState().auctions.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/auctions', ActionConstants.GET_AUCTIONS));
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

export function openBidModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: BID_MODAL },
        status: SUCCESS
    }
}

// this is intentionally duplicated because as far as react is concerned it is a different
// action than commenting on a ticket, contract, review, etc.
export function commentOnAuction(user, auction, text) {
    const data = {
        user: user, // We need this for now, until the api is fixed
        ticket: {id: auction.ticket.id},
        content: text
    };
    return dispatchedRequest('POST', '/comments', ActionConstants.COMMENT_ON_AUCTION, data);
}
