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
                    bidOnAuction = Object.assign({}, auctions.items.get(action.response.bid.auction.id));
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
        case ActionConstants.APPROVE_NOMINATION:
            // TODO: Look into changing signature of handleApprovedNomination func to (status, auctions, nomination)
            const auctionForNomination = auctions.items.get(action.response.auction ? action.response.auction.id : action.response.nomination.auction.id);
            return handleApprovedNomination(action.status, auctions, auctionForNomination, action.response.nomination);
            break;
        case ActionConstants.COMMENT_ON_AUCTION:
            return handleCommentOnAuction(action.status, auctions, action.response.comment || action.response);
            break;
        case ActionConstants.LOGOUT: return initialAuctions; break;
        default: return auctions; break;
    }
}

// Not entirely sure this function is pure (i.e., doesn't have side effects)
function handleApprovedNomination(requestStatus, auctions, modifiedAuction, modifiedNomination) {
    let newAuction;
    let newAuctions;
    switch (requestStatus) {
        case PENDING:
            newAuction = Object.assign({}, modifiedAuction);
            newAuction.ticket_set.nominations.forEach(n => n.contractor.id == modifiedNomination.contractor.id ? n.isFetching = true : null);
            newAuctions = Array.from(auctions.items.values()).map(a => a.id == newAuction.id ? newAuction : a)
            return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)]))};
            break;
        case ERROR: return { isFetching: false, items: auctions.items }; break;
        case SUCCESS:
            newAuction = Object.assign({}, modifiedAuction);
            newAuction.ticket_set.nominations.forEach(n => n.contractor.id == modifiedNomination.contractor.id ? n.isFetching = false : null);
            newAuction.approved_talents = newAuction.approved_talents.map(t => Object.assign({}, t));
            newAuction.approved_talents.push(modifiedNomination);
            newAuctions = Array.from(auctions.items.values()).map(a => a.id == newAuction.id ? newAuction : a)
            return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)])) };
            break;
    }
}

function handleCommentOnAuction(requestStatus, auctions, comment) {
    const oldAuctions = Array.from(auctions.items.values());
    let modifiedAuction = oldAuctions.find(a => a.ticket.id == comment.ticket.id);
    switch (requestStatus) {
        case PENDING: modifiedAuction = Object.assign({}, modifiedAuction, {isFetching: true}); break;
        case ERROR: modifiedAuction = Object.assign({}, modifiedAuction, {isFetching: false}); break;
        case SUCCESS:
            modifiedAuction = addSyntheticProperties(Object.assign({}, modifiedAuction, {isFetching: false}));
            modifiedAuction.ticket.comments = modifiedAuction.ticket.comments.map(c => c);
            modifiedAuction.ticket.comments.push(comment);
        break;
    }
    const newAuctions = oldAuctions.map(t => t.id == modifiedAuction.id ? modifiedAuction : t);
    return { isFetching: false, items: new Map(newAuctions.map(a => [a.id, addSyntheticProperties(a)])) }
}

function addSyntheticProperties(auction) {
    let newAuction = Object.assign({}, auction);
    Object.defineProperty(newAuction, 'ticket', {
        get: function() { return newAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket; },
        set: function(ticket) { newAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket = ticket; },
    });
    Object.defineProperty(newAuction, 'contract', {
        get: function() {
            let winningBid = auction.bids.find(bid => bid.contract);
            return winningBid !== undefined ? winningBid.contract : null;
        },
    });
    Object.defineProperty(newAuction, 'work', {
        get: function() {
            let winningBid = auction.bids.find(bid => bid.contract);
            return winningBid !== undefined ? winningBid.work_offers[0].work : null;
        },
    });
    Object.defineProperty(newAuction, 'nominations', {
        get: function() { return newAuction.ticket_set.nominations; },
    });
    return newAuction;
}
