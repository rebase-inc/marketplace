import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialContracts = { items: new Map(), isFetching: false };

function _shouldBeVisible() { return true; }

export default function contracts(contracts = initialContracts, action) {
    switch (action.type) {
        case ActionConstants.GET_CONTRACTS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
                case SUCCESS:
                    const newContracts = new Map(action.response.contracts.filter(_shouldBeVisible).map(c => [c.id, addSyntheticProperties(c)]));
                    return { isFetching: false, items: newContracts };
            }
        }
        case ActionConstants.LOGOUT: return initialContracts; break;
        default: return contracts; break;
    }
}

function addSyntheticProperties(contract) {
    let newContract = Object.assign({}, contract);
    Object.defineProperty(newContract, 'ticket', {
        get: function() { return newContract.bid.work_offers[0].ticket_snapshot.ticket; },
        set: function(ticket) { newContract.bid.work_offers[0].ticket_snapshot.ticket = ticket; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    Object.defineProperty(newContract, 'work', {
        get: function() { return newContract.bid.work_offers[0].work; },
        set: function(work) { newContract.bid.work_offers[0].work = work; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return newContract;
}
