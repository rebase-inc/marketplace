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
                    return Object.assign({}, tickets); // temp hack
                    const newTickets = tickets.filter(ticket => ticket.id != action.response.ticket.id);
                    return { isFetching: false, items: newTickets };
                    break;
            }
        }
        default:
            return tickets;
    }
}
