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
        case ActionConstants.CREATE_TICKET:
            // the fact that we have to have an OR between internal ticket and github ticket below suggests that
            // we maybe should separate the CREATE_TICKET action into CREATE_INTERNAL_TICKET and CREATE_GITHUB_TICKET
            // actions. Though it's not a big deal for now...
            return handleNewTicket(action.status, tickets, action.response.internal_ticket || action.response.github_ticket); break;
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

function handleNewTicket(requestStatus, oldTicket, newTicket) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldTicket, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldTicket, { isFetching: false }); break;
        case SUCCESS: return { isFetching: false, id: newTicket.id }; break;
    }
}
