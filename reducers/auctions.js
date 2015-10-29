import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialAuctions = { items: new Map(), isFetching: false };

// hack to only show available auction. TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(auction) {
    return (auction.state == 'created' || auction.state == 'waiting_for_bids')
}

export default function auctions(auctions = initialAuctions, action) {
    if ( action.type == undefined ) console.warn('UNDEFINED ACTION TYPE IN AUCTIONS REDUCER');
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case SUCCESS:
                    const newAuctions = new Map(action.response.auctions.filter(_shouldBeVisible).map(a => [a.id, addSyntheticProperties(a)]));
                    return { isFetching: false, items: newAuctions };
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case ERROR: return Object.assign({}, auctions, { isFetching: false }); break;
                case SUCCESS:
                    const auctionsPlusOne = new Map(auctions.items);
                    auctionsPlusOne.set(action.response.auction.id, addSyntheticProperties(action.response.auction));
                    return { isFetching: false, items: auctionsPlusOne };
                    break;
            }
        }
        case ActionConstants.BID_ON_AUCTION: {
            let bidOnAuction;
            let theNewAuctions; // TODO: Break this reducer into multiple reducers so I don't have to use ridiculous names
            switch (action.status) {
                case PENDING:
                    // assign the auction in question to a new object so we can change it
                    bidOnAuction = Object.assign({}, auctions.items.get(action.response.auction.id), action.response.auction);
                    bidOnAuction.isFetching = true;

                    // create a list of new auctions with the modified auction replacing the appropriate one from the old list
                    theNewAuctions = Array.from(auctions.items.values()).map(a => a.id == bidOnAuction.id ? bidOnAuction : a);

                    // isFetching=false here because we are not actually modifying the auctions, but rather one specific auction
                    return { isFetching: false, items: new Map(theNewAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
                    break;
                return Object.assign({}, auctions, { isFetching: true }); break;
                case ERROR: return Object.assign({}, auctions, { isFetching: false }); break;
                case SUCCESS:
                    // assign the auction in question to a new object so we can change it
                    bidOnAuction = Object.assign({}, auctions.items.get(action.response.auction.id), action.response.auction);
                    bidOnAuction.isFetching = false;

                    // create a list of new auctions with the modified auction replacing the appropriate one from the old list
                    theNewAuctions = Array.from(auctions.items.values()).map(a => a.id == bidOnAuction.id ? bidOnAuction : a);

                    return { isFetching: false, items: new Map(theNewAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
                    break;
            }
        }
        case ActionConstants.APPROVE_NOMINATION: {
            let modifiedAuction;
            let newAuctions;
            // this takes the list of bids on the response and sets it to the bids field on the auction
            // so that we can infer who has bid on the auction and therefore what state a nomination is in.
            // This is kind of hectic. And I'm not entirely sure if its pure (i.e., no side effects) TODO: Cleanup
            switch (action.status) {
                case PENDING:
                    // assign the auction in question to a new object so we can change it
                    modifiedAuction = Object.assign({}, auctions.items.get(action.response.auction.id));

                    // set isFetching=true on the nomination in question
                    modifiedAuction.ticket_set.nominations = modifiedAuction.ticket_set.nominations.map(n =>
                         n.contractor.id == action.response.nomination.contractor.id ? Object.assign({ isFetching: true }, n) : n);

                    // create a list of new auctions with the modified auction replacing the appropriate one from the old list
                    newAuctions = Array.from(auctions.items.values()).map(a => a.id == modifiedAuction.id ? modifiedAuction : a);

                    // isFetching=false here because we are not actually modifying the auction, but rather a nested object in the auctions
                    return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
                    break;
                case ERROR: return Object.assign({}, auctions, { isFetching: false }); break;
                case SUCCESS:
                    // assign the auction in question to a new object so we can change it
                    modifiedAuction = Object.assign({}, auctions.items.get(action.response.auction.id));

                    // set isFetching=false on the nomination in question
                    modifiedAuction.ticket_set.nominations = modifiedAuction.ticket_set.nominations.map(n =>
                         n.contractor.id == action.response.nomination.contractor.id ? Object.assign({ isFetching: false }, n) : n);

                    // add the new nomination to the list of approved_talents
                    modifiedAuction.approved_talents.push(action.response.nomination);

                    // create a list of new auctions with the modified auction replacing the appropriate one from the old list
                    newAuctions = Array.from(auctions.items.values()).map(a => a.id == modifiedAuction.id ? modifiedAuction : a);
                    return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
                    break;
            }
        }
        case ActionConstants.LOGOUT: return initialAuctions; break;
        default: return auctions; break;
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
    Object.defineProperty(newAuction, 'nominations', {
        get: function() { return newAuction.ticket_set.nominations; },
    });
    return newAuction;
}
