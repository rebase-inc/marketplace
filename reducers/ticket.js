import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialTicket = { id: null, isFetching: false };

export default function ticket(ticket = initialTicket, action) {
    switch (action.type) {
        case ActionConstants.SELECT_TICKET: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.ticketId }
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, ticket, { isFetching: true }); break;
                case ERROR: return Object.assign({}, ticket, { isFetching: false }); break;
                case SUCCESS:
                    return initialTicket;
                    break;
            }
        }
        case ActionConstants.LOGOUT: return initialTicket; break;
        default: return ticket; break;
    }
}
