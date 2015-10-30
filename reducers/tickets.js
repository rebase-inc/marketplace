import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTickets = { items: [], isFetching: false };

// hack to only show non auctioned tickets. TODO: Add query parameter like ?new=true or equivalent to api
function _shouldBeVisible(ticket) {
    return !ticket.snapshots.some(snap => !!snap.bid_limit.ticket_set.auction)
}

export default function tickets(tickets = initialTickets, action) {
    switch (action.type) {
        case ActionConstants.GET_TICKETS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, tickets, { isFetching: true }); break;
                case SUCCESS:
                    const newTickets = new Map(action.response.tickets.filter(_shouldBeVisible).map(t => [t.id, t]));
                    return { isFetching: false, items: newTickets };
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, tickets, { isFetching: true }); break;
                case ERROR: return Object.assign({}, tickets, { isFetching: false }); break;
                case SUCCESS:
                    // this is kind of hacky...TODO: Think of a cleaner way to remove an auctioned ticket from the state
                    const newTickets = Array.from(tickets.items.values()).filter(ticket =>
                            ticket.id != action.response.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.id);
                    return { isFetching: false, items: new Map(newTickets.map(t => [t.id, t])) };
                    break;
            }
        }
        case ActionConstants.COMMENT_ON_TICKET: {
            // on pending, the comment is not nested in a comment object, but it is on response (success)
            // hence the weird or statement for the last argument in the below function
            return handleCommentOnTicket(action.status, tickets, action.response.comment || action.response);
        }
        case ActionConstants.LOGOUT: return initialTickets; break;
        default: return tickets; break;
    }
}

function handleCommentOnTicket(requestStatus, tickets, comment) {
    const oldTickets = Array.from(tickets.items.values());
    let modifiedTicket = oldTickets.find(t => t.id == comment.ticket.id);
    switch (requestStatus) {
        case PENDING: modifiedTicket = Object.assign({}, modifiedTicket, {isFetching: true}); break;
        case ERROR: modifiedTicket = Object.assign({}, modifiedTicket, {isFetching: false}); break;
        case SUCCESS:
            modifiedTicket.comments.push(comment);
            modifiedTicket = Object.assign({}, modifiedTicket, {isFetching: false});
        break;
    }
    const newTickets = oldTickets.map(t => t.id == modifiedTicket.id ? modifiedTicket : t);
    return { isFetching: false, items: new Map(newTickets.map(t => [t.id, t])) }
}
