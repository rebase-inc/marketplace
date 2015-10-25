import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTickets = { items: [], isFetching: false };

export default function tickets(tickets = initialTickets, action) {
    switch (action.type) {
        case ActionConstants.GET_TICKETS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, tickets, { isFetching: true }); break;
                case SUCCESS:
                    return Object.assign({}, tickets, { isFetching: false }, { items: action.response.tickets }); break;
            }
        }
        default:
            return tickets;
    }
}
