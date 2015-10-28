import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialAuctions = { items: new Map(), isFetching: false };

export default function auctions(auctions = initialAuctions, action) {

    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auctions, { isFetching: true }); break;
                case SUCCESS:
                    return { isFetching: false, items: new Map(action.response.auctions.map(a => [a.id, addSyntheticProperties(a)])) };
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
                    console.log('new auctions is ', newAuctions);
                    return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
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
    Object.defineProperty(newAuction, 'nominations', {
        get: function() { return newAuction.ticket_set.nominations; },
    });
    return newAuction;
}
