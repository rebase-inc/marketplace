import fetch from 'isomorphic-fetch';

import ActionConstants from '../constants/ActionConstants';
import { ERROR, PENDING, SUCCESS } from '../constants/RequestConstants';

function handleStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

export function getTickets() {
    return function(dispatch) {
        dispatch({ type: ActionConstants.GET_TICKETS, status: PENDING });
        return fetch('http://localhost:5000/tickets', { credentials: 'include' })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.GET_TICKETS, status: SUCCESS, response: json }))
            .catch(json => dispatch({ type: ActionConstants.GET_TICKETS, status: ERROR, response: json }));
    };
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
