import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

import { getAuctionTicket } from '../utils/getters'; 

// Not entirely sure if we need to use a record here. It allows for property getting which is nice,
// but we have to define and instantiate it at the same time, which is weird.
const initialTickets = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

// hack to only show non auctioned tickets. TODO: Add query parameter like ?new=true or equivalent to api
function _shouldBeVisible(ticket) {
    return !ticket.snapshots.some(snap => !!snap.bid_limit.ticket_set.auction)
}

export default function tickets(tickets = initialTickets, action) {
    switch (action.type) {
        case ActionConstants.GET_TICKETS: return handleNewTickets(action.status, tickets, action.response.tickets); break;
        case ActionConstants.CREATE_AUCTION: 
            const auctionedTicket = action.response.auction ? getAuctionTicket(action.response.auction) : null;
            return handleCreateAuction(action.status, tickets, auctionedTicket);
            break;
        case ActionConstants.COMMENT_ON_TICKET:
            // on pending, the comment is not nested in a comment object, but it is on response (success)
            // hence the weird or statement for the last argument in the below function
            return handleCommentOnTicket(action.status, tickets, action.response.comment || action.response);
            break;
        case ActionConstants.CREATE_TICKET:
            // the fact that we have to have an OR between internal ticket and github ticket below suggests that
            // we maybe should separate the CREATE_TICKET action into CREATE_INTERNAL_TICKET and CREATE_GITHUB_TICKET
            // actions. Though it's not a big deal for now...
            return handleNewTicket(action.status, tickets, action.response.internal_ticket || action.response.github_ticket); break;
        case ActionConstants.LOGOUT: return initialTickets; break;
        default: return tickets; break;
    }
}

function handleNewTicket(requestStatus, oldTickets, newTicket) {
    switch (requestStatus) {
        case PENDING: return oldTickets.set('isFetching', true);
        case ERROR: return oldTickets.set('isFetching', false);
        case SUCCESS: 
            return oldTickets.mergeDeep({ items: [[newTicket.id, newTicket]], isFetching: false });
    }
}

function handleCreateAuction(requestStatus, oldTickets, auctionedTicket) {
    switch (requestStatus) {
        case PENDING: return oldTickets.set('isFetching', true);
        case ERROR: return oldTickets.set('isFetching', false);
        case SUCCESS: return oldTickets.deleteIn(['items', auctionedTicket.id ]).set('isFetching', false);
    }
}

function handleNewTickets(requestStatus, oldTickets, newTickets) {
    switch (requestStatus) {
        case PENDING: return oldTickets.set('isFetching', true);
        case ERROR: return oldTickets.set('isFetching', false);
        case SUCCESS: return oldTickets.mergeDeep({ isFetching: false, items: newTickets.filter(_shouldBeVisible).map(t => [t.id, t]) });
    }
}

function handleCommentOnTicket(requestStatus, oldTickets, comment) {
    const ticketId = comment.ticket.id;
    const commentIndex = oldTickets.getIn(['items', ticketId, 'comments']).findIndex(c => c.content == comment.content);
    switch (requestStatus) {
        case PENDING:
            comment = Immutable.Map(comment).set('isFetching', true);
            return oldTickets.updateIn(['items', ticketId, 'comments'], comments => comments.push(comment));
        case ERROR:
            return oldTickets.deleteIn(['items', ticketId, 'comments', commentIndex]);
        case SUCCESS:
            return oldTickets.mergeIn(['items', ticketId, 'comments', commentIndex], comment, { isFetching: false });
    }
}
