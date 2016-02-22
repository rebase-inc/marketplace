import Immutable from 'immutable';

import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import ActionConstants from '../constants/ActionConstants';

let initialNotification = null;

const EVENT_STRINGS = [];
EVENT_STRINGS[ActionConstants.CREATE_TICKET] = (response) => 'Ticket "' + response.internal_ticket.title + '" Created';
EVENT_STRINGS[ActionConstants.CREATE_AUCTION] = (response) => ('Ticket "' +
    response.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.title + '" Auctioned with a Maximum Budget of $' +
        response.auction.ticket_set.bid_limits[0].price);

export default function notification(notification = initialNotification, action) {
    switch (action.type) {
        case ActionConstants.CLEAR_NOTIFICATION: return initialNotification; break;
        case ActionConstants.MAKE_NOTIFICATION: return action.response.text; break;
        default: return addEvent(notification, action); break;
    }
}

function addEvent(notification, action) {
    switch (action.status) {
        case PENDING: return notification;
        case ERROR: return notification;
        case SUCCESS:
            return EVENT_STRINGS[action.type] ? EVENT_STRINGS[action.type](action.response) : notification;
        default: return notification;
    }
}
