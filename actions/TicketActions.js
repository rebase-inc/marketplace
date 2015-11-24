import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';
import { CREATE_TICKET_MODAL, CREATE_AUCTION_MODAL } from '../constants/ModalConstants';

export function getTickets() {
    // only get tickets if the tickets aren't already in a loading state
    return (dispatch, getState) => (!!getState().tickets.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/tickets', ActionConstants.GET_TICKETS));
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
        user: { id: user.id }, // We need this for now, until the api is fixed
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

export function openNewAuctionModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: CREATE_AUCTION_MODAL },
        status: SUCCESS
    }
}

export function openNewTicketModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: CREATE_TICKET_MODAL },
        status: SUCCESS
    }
}

export function closeModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: undefined },
        status: SUCCESS
    }
}
