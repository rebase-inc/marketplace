import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialAuctions = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

// hack to only show available auction. TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(auction) {
    return (auction.state == 'created' || auction.state == 'waiting_for_bids')
}

export default function auctions(auctions = initialAuctions, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, auctions, action.response.user); break;
        case ActionConstants.GET_AUCTIONS: return handleNewAuctions(action.status, auctions, action.response.auctions); break;
        case ActionConstants.CREATE_AUCTION: return handleNewAuction(action.status, auctions, action.response.auction); break;
        case ActionConstants.BID_ON_AUCTION: return handleBidOnAuction(action.status, auctions, action.response.auction || action.response.bid.auction); break;
        case ActionConstants.APPROVE_NOMINATION: return handleApprovedNomination(action.status, auctions, action.response.auction, action.response.nomination); break;
        case ActionConstants.COMMENT_ON_AUCTION:
            return handleCommentOnAuction(action.status, auctions, action.response.comment || action.response);
            break;
        case ActionConstants.LOGOUT: return initialAuctions; break;
        default: return auctions; break;
    }
}

function handleNewAuctions(requestStatus, oldAuctions, newAuctions) {
    switch (requestStatus) {
        case PENDING: return oldAuctions.set('isFetching', true); break;
        case ERROR: return oldAuctions.set('isFetching', false); break;
        case SUCCESS: return oldAuctions.mergeDeep({ isFetching: false, items: newAuctions.filter(_shouldBeVisible).map(a => [a.id, a]) }); break;
    }
}

function handleApprovedNomination(requestStatus, auctions, auction, nomination) {
    const auctionID = auction.id || nomination.auction.id;
    const nominationIndex = auctions.getIn(['items', auctionID, 'ticket_set', 'nominations']).findIndex(n => n.contractor.id == nomination.contractor.id);
    switch (requestStatus) {
        case PENDING: return auctions.setIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], true);
        case ERROR: return auctions.setIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], false);
        case SUCCESS:
            const notFetching = auctions.mergeIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], false)
            return notFetching.updateIn(['items', auctionID, 'approved_talents'], approved => approved.push(nomination));
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

function handleNewRole(requestStatus, oldTickets, user) {
    switch (requestStatus) {
        case PENDING: return oldAuctions.set('isFetching', true);
        case ERROR: return oldAuctions.set('isFetching', false);
        case SUCCESS: return initialAuctions;
    }
}

function handleNewAuction(requestStatus, oldAuctions, newAuction) {
    switch (requestStatus) {
        case PENDING: return oldAuctions.set('isFetching', true);
        case ERROR: return oldAuctions.set('isFetching', false);
        case SUCCESS: return oldAuctions.mergeDeep({ items: [newAuction.id, newAuction], isFetching: false });
    }
}

function handleBidOnAuction(requestStatus, auctions, auction) {
    switch (requestStatus) {
        case PENDING: return auctions.setIn(['items', auction.id, 'isFetching'], true);
        case ERROR: return auctions.setIn(['items', auction.id, 'isFetching'], false);
        case SUCCESS: return auctions.mergeIn(['items', auction.id], auction);
    }
}
