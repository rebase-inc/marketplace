import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialAuctions = { items: [], isFetching: false };

export default function auctions(auctions = initialAuctions, action) {
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case SUCCESS:
                    const newAuctions = { items: action.response.auctions.map(a => addSyntheticProperties(a)) }
                    return Object.assign({}, { isFetching: false }, newAuctions); break;
            }
        }
        default:
            return auctions;
    }
}

function addSyntheticProperties(auction) {
    let newAuction = Object.assign({}, auction);
    Object.defineProperty(newAuction, 'ticket', {
        get: function() { return newAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket; },
        //set: function(ticket) { auction.ticket_set.bid_limits[0].ticket_snapshot.ticket = ticket; },
    });
    Object.defineProperty(newAuction, 'contract', {
        get: function() { return newAuction.bids[0].contract; },
    });
    return newAuction;
}
