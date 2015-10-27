import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTicket = { id: null, isFetching: false };

export default function tickets(ticket = initialTicket, action) {
    switch (action.type) {
        case ActionConstants.SELECT_TICKET: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.ticketId }
            }
        }
        default:
            return ticket;
    }
}
