import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialDebits = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

export default function debits(debits = initialDebits, action) {
    switch (action.type) {
        case ActionConstants.GET_DEBITS: return handleNewDebits(action.status, debits, action.response.debits); break;
        case ActionConstants.LOGOUT: return initialDebits; break;
        default: return debits; break;
    }
}

function handleNewDebits(requestStatus, oldDebits, newDebits) {
    switch (requestStatus) {
        case PENDING: return oldDebits.set('isFetching', true);
        case ERROR: return oldDebits.set('isFetching', false);
        case SUCCESS: return oldDebits.mergeDeep({ isFetching: false, items: newDebits.map(t => [t.id, t]) });
    }
}
