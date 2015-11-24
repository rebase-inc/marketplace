import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW } from '../constants/ViewConstants';

let initialTicket = { id: null, isFetching: false };

export default function ticket(ticket = initialTicket, action) {
    switch (action.type) {
        case ActionConstants.SELECT_TICKET: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.ticketId }
            }
        }
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, ticket); break;
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, ticket, { isFetching: true }); break;
                case ERROR: return Object.assign({}, ticket, { isFetching: false }); break;
                case SUCCESS:
                    return initialTicket;
                    break;
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case SUCCESS:
                    return (action.response.viewType == NEW) ? initialTicket : ticket;
                    break;
            }
        }
        case ActionConstants.LOGOUT: return initialTicket; break;
        default: return ticket; break;
    }
}

function handleNewRole(requestStatus, oldTicket) {
    switch (requestStatus) {
        case PENDING: return oldTicket; break;
        case ERROR: return oldTicket; break;
        case SUCCESS: return initialTicket; break;
    }
}
