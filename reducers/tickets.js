import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTickets = { items: [], isFetching: false };

// hack to only show non auctioned tickets. TODO: Add query parameter like ?new=true or equivalent to api
function _shouldBeVisible(ticket) {
    return !ticket.snapshots.some(snap => !!snap.bid_limit.ticket_set.auction)
}

export default function tickets(tickets = initialTickets, action) {
    switch (action.type) {
        case ActionConstants.GET_TICKETS: return handleNewTickets(action.status, tickets, action.response.tickets); break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, tickets, action.response.user); break;
        case ActionConstants.CREATE_AUCTION:
            const auctionedTicket = action.response.auction ? action.response.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket : null;
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

function handleNewRole(requestStatus, oldTickets, user) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldTickets, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldTickets, { isFetching: false }); break;
        case SUCCESS: return initialTickets; break;
    }
}

function handleNewTicket(requestStatus, oldTickets, newTicket) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldTickets, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldTickets, { isFetching: false }); break;
        case SUCCESS:
            const newTickets = Object.assign({}, oldTickets, { isFetching: false });
            newTickets.items.set(newTicket.id, newTicket);
            return newTickets;
            break;
    }
}

function handleCreateAuction(requestStatus, oldTickets, auctionedTicket) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldTickets, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldTickets, { isFetching: false }); break;
        case SUCCESS:
            const newTickets = Array.from(oldTickets.items.values()).filter(ticket => ticket.id != auctionedTicket.id);
            return { isFetching: false, items: new Map(newTickets.map(t => [t.id, t])) };
            break;
    }
}

function handleNewTickets(requestStatus, oldTickets, newTickets) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldTickets, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldTickets, { isFetching: false }); break;
        case SUCCESS:
            return { isFetching: false, items: new Map(newTickets.filter(_shouldBeVisible).map(t => [t.id, t])) }
    }

}

function handleCommentOnTicket(requestStatus, tickets, comment) {
    const oldTickets = Array.from(tickets.items.values());
    let modifiedTicket = oldTickets.find(t => t.id == comment.ticket.id);
    // push the comment onto the stack as soon as we know about it. Delete or
    // confirm on Error/Success
    switch (requestStatus) {
        case PENDING: 
            modifiedTicket.comments = modifiedTicket.comments.map(c => Object.assign({}, c));
            comment.isFetching = true;
            modifiedTicket.comments.push(Object.assign({}, comment));
            modifiedTicket = Object.assign({}, modifiedTicket);
            break;
        case ERROR:
            modifiedTicket.comments = modifiedTicket.comments.filter(c => c.content != comment.content).map(c => Object.assign({}, c));
            modifiedTicket = Object.assign({}, modifiedTicket);
            break;
        case SUCCESS:
            modifiedTicket.comments = modifiedTicket.comments.map(c => c.content == comment.content ? Object.assign({}, comment, {isFetching: false}) : Object.assign({}, c));
            modifiedTicket = Object.assign({}, modifiedTicket);
            break;
    }
    const newTickets = oldTickets.map(t => t.id == modifiedTicket.id ? modifiedTicket : t);
    return { isFetching: false, items: new Map(newTickets.map(t => [t.id, t])) }
}
