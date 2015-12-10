import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialCredits = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

export default function credits(credits = initialCredits, action) {
    switch (action.type) {
        case ActionConstants.GET_CREDITS: return handleNewCredits(action.status, credits, action.response.credits); break;
        case ActionConstants.LOGOUT: return initialCredits; break;
        default: return credits; break;
    }
}

function handleNewCredits(requestStatus, oldCredits, newCredits) {
    switch (requestStatus) {
        case PENDING: return oldCredits.set('isFetching', true);
        case ERROR: return oldCredits.set('isFetching', false);
        case SUCCESS: return oldCredits.mergeDeep({ isFetching: false, items: newCredits.map(c => [c.id, c]) });
    }
}
