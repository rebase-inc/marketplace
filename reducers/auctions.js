import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialAuctions = { items: new Map(), isFetching: false };

export default function auctions(auctions = initialAuctions, action) {
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case SUCCESS:
                    const newAuctions = new Map(action.response.auctions.map(a => [a.id, addSyntheticProperties(a)]));
                    return { isFetching: false, items: newAuctions };
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case ERROR: return Object.assign({}, auctions, { isFetching: false }); break;
                case SUCCESS:
                    const newAuctions = new Map(auctions.items);
                    newAuctions.set(action.response.auction.id, addSyntheticProperties(action.response.auction));
                    return { isFetching: false, items: newAuctions };
                    break;
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
