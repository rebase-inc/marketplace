import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTickets = { items: [], isFetching: false };

export default function tickets(tickets = initialTickets, action) {
    switch (action.type) {
        case ActionConstants.GET_TICKETS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, tickets, { isFetching: true }); break;
                case SUCCESS:
                    const newTickets = new Map(action.response.tickets.map(t => [t.id, t]));
                    return { isFetching: false, items: newTickets };
            }
        }
        default:
            return tickets;
    }
}
