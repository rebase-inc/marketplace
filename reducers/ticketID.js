import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW } from '../constants/ViewConstants';

let initialTicketID = null;

export default function ticketID(ticketID = initialTicketID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_TICKET: return action.response.ticketId; break;
        case ActionConstants.CREATE_TICKET: return handleNewTicket(action.status, ticketID, action.response.internal_ticket || action.response.github_ticket); break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, ticketID); break;
        case ActionConstants.CREATE_AUCTION: return handleNewRole(action.status, ticketID); break;
        case ActionConstants.SELECT_VIEW: return (action.response.viewType == NEW) ? initialTicketID : ticketID; break;
        case ActionConstants.LOGOUT: return initialTicketID; break;
        default: return ticketID; break;
    }
}

function handleNewRole(requestStatus, oldTicketID) {
    switch (requestStatus) {
        case PENDING: return oldTicketID; break;
        case ERROR: return oldTicketID; break;
        case SUCCESS: return initialTicketID; break;
    }
}

function handleNewTicket(requestStatus, oldTicketID, newTicket) {
    switch (requestStatus) {
        case PENDING: return oldTicketID; break;
        case ERROR: return oldTicketID; break;
        case SUCCESS: return newTicket.id; break;
    }
}
