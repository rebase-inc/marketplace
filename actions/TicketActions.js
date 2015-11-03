import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getTickets() {
    return dispatchedRequest('GET', '/tickets', ActionConstants.GET_TICKETS);
}

export function createAuction(ticket, price) {
    const data = {
        ticket_set: {
            bid_limits: [{ ticket_snapshot: { ticket: { id: ticket.id } }, price: price }]
        },
        term_sheet: { legalese: 'n/a' },
        organization: ticket.project.organization,
    }
    return dispatchedRequest('POST', '/auctions', ActionConstants.CREATE_AUCTION, data);
}

export function selectTicket(ticketId) {
    return {
        type: ActionConstants.SELECT_TICKET,
        response: { ticketId: ticketId },
        status: SUCCESS
    }
}

export function commentOnTicket(user, ticket, text) {
    const data = {
        user: user, // We need this for now, until the api is fixed
        ticket: {id: ticket.id},
        content: text
    };
    return dispatchedRequest('POST', '/comments', ActionConstants.COMMENT_ON_TICKET, data);
}

export function createInternalTicket(project, title) {
    const data = {
        project: { id: project.id },
        title: title
    }
    return dispatchedRequest('POST', '/internal_tickets', ActionConstants.CREATE_TICKET, data);
}

export function createGithubTicket(project, title) {
    const data = {
        project: { id: project.id },
        title: title
    }
    return dispatchedRequest('POST', '/github_tickets', ActionConstants.CREATE_TICKET, data);
}
