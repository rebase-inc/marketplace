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

//module.exports = {
    //createInternalTicket: function(project, title) {
        //let actionType = ActionConstants.CREATE_INTERNAL_TICKET;
        //let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //let pendingAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //Api.createInternalTicket(project, title, responseAction, pendingAction);
    //},
    //getTicketData: function() {
        //var pendingAction = function() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_TICKET_DATA,
                //status: RequestConstants.PENDING,
            //});
        //};
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.GET_TICKET_DATA,
                //status: status,
                //response: response
            //});
        //};
        //Api.getTicketData(responseAction, pendingAction);
    //},
    //selectTicket: function(ticketID) {
        //!ticketID ? console.warn('No ticket ID provided!') : null;
        //Dispatcher.handleRequestAction({
            //type: ActionConstants.SELECT_TICKET,
            //ticketID: ticketID,
        //});
    //},
//};
