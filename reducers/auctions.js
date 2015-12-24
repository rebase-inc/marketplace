import Immutable from 'immutable';

import { getAuctionTicket } from '../utils/getters';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialAuctions = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

// hack to only show available auction. TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _shouldBeVisible(auction) {
    return (auction.state == 'created' || auction.state == 'waiting_for_bids')
}

export default function auctions(auctions = initialAuctions, action) {
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: return handleNewAuctions(action.status, auctions, action.response.auctions); break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, auctions, action.response.user); break;
        case ActionConstants.CREATE_AUCTION: return handleNewAuction(action.status, auctions, action.response.auction); break;
        case ActionConstants.BID_ON_AUCTION: return handleBidOnAuction(action.status, auctions, action.response.auction || action.response.bid.auction); break;
        case ActionConstants.APPROVE_NOMINATION: return handleApprovedNomination(action.status, auctions, action.response.auction, action.response.nomination); break;
        case ActionConstants.COMMENT_ON_AUCTION: return handleCommentOnAuction(action.status, auctions, action.response.comment || action.response); break;
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
    const auctionID = (auction || nomination.auction).id;
    const nominationIndex = auctions.getIn(['items', auctionID, 'ticket_set', 'nominations']).findIndex(n => n.getIn(['contractor','id']) == nomination.contractor.id);
    switch (requestStatus) {
        case PENDING: return auctions.setIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], true);
        case ERROR: return auctions.setIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], false);
        case SUCCESS:
            const notFetching = auctions.mergeIn(['items', auctionID, 'ticket_set', 'nominations', nominationIndex, 'isFetching'], false)
            return notFetching.updateIn(['items', auctionID, 'approved_talents'], approved => approved.push(nomination));
    }
}

function handleCommentOnAuction(requestStatus, auctions, comment) {
    // "auction" comments really go on the ticket...but that probably should be changed
    const auctionId = auctions.get('items').findKey(a => getAuctionTicket(a.toJS()).id == comment.ticket.id);
    const commentKeyPath = ['items', auctionId, 'ticket_set', 'bid_limits', 0, 'ticket_snapshot', 'ticket', 'comments'];
    const commentIndex = auctions.getIn(commentKeyPath).findIndex(c => c.content == comment.content);
    switch (requestStatus) {
        case PENDING:
            comment = Immutable.Map(comment).set('isFetching', true);
            return auctions.updateIn(commentKeyPath, comments => comments.push(comment));
        case ERROR: return auctions.deleteIn(commentKeyPath.concat(commentIndex));
        case SUCCESS: return auctions.mergeIn(commentKeyPath.concat(commentIndex), comment, { isFetching: false });
    }
}

function handleNewRole(requestStatus, oldAuctions, user) {
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
        case SUCCESS: return oldAuctions.mergeDeepIn(['items', newAuction.id], newAuction).set('isFetching', false);
    }
}

function handleBidOnAuction(requestStatus, auctions, auction) {
    switch (requestStatus) {
        case PENDING: return auctions.setIn(['items', auction.id, 'isFetching'], true);
        case ERROR: return auctions.setIn(['items', auction.id, 'isFetching'], false);
        case SUCCESS: return auctions.mergeDeepIn(['items', auction.id], auction);
    }
}
