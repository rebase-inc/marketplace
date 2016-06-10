import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW } from '../constants/ViewConstants';

let initialTicketID = null;

export default function ticketID(ticketID = initialTicketID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_TICKET: return action.response.ticketId; break;
        case ActionConstants.GET_TICKETS: return handleNewTickets(action.status, ticketID, action.response.tickets); break;
        case ActionConstants.CREATE_TICKET: return handleNewTicket(action.status, ticketID, action.response.internal_ticket || action.response.github_ticket); break;
        case ActionConstants.CREATE_AUCTION: return deleteID(action.status, ticketID); break;
        case ActionConstants.SELECT_ROLE: return (action.status == SUCCESS) ? initialTicketID : ticketID; break;
        case ActionConstants.LOGOUT: return initialTicketID; break;
        default: return ticketID; break;
    }
}

function handleNewTicket(requestStatus, oldTicketID, newTicket) {
    switch (requestStatus) {
        case PENDING: return oldTicketID; break;
        case ERROR: return oldTicketID; break;
        case SUCCESS: return newTicket.id; break;
    }
}

function deleteID(status, ticketID) {
    switch (status) {
        case PENDING: return ticketID; break;
        case ERROR: return ticketID; break;
        case SUCCESS: return initialTicketID; break;
    }
}

function handleNewTickets(requestStatus, ticketID, tickets) {
    switch (requestStatus) {
        case PENDING: return ticketID; break;
        case ERROR: return ticketID; break;
        case SUCCESS:
            const newTicket = tickets.find(t => !t.snapshots.some(snap => !!snap.bid_limit.ticket_set.auction));
            return !!newTicket ? newTicket.id : ticketID;
    }
}

