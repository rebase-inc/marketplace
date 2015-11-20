import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialContracts = { items: new Map(), isFetching: false };

function _shouldBeVisible() { return true; }

export default function contracts(contracts = initialContracts, action) {
    let modifiedContract;
    let newContracts;
    switch (action.type) {
        case ActionConstants.GET_CONTRACTS: {
            switch (action.status) {
                case PENDING:
                    return Object.assign({}, contracts, { isFetching: true });
                    break;
                case SUCCESS:
                    newContracts = new Map(action.response.contracts.filter(_shouldBeVisible).map(c => [c.id, addSyntheticProperties(c)]));
                    return { isFetching: false, items: newContracts };
            }
        }
        case ActionConstants.BID_ON_AUCTION: return addNewContract(action.status, contracts, action.response.auction);
        case ActionConstants.SUBMIT_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.ACCEPT_WORK: return removeContract(action.status, contracts, action.response.work);
        case ActionConstants.DISPUTE_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_BLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_UNBLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.LOGOUT: return initialContracts; break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contracts, action.response.user); break;
        default: return contracts; break;
    }
}

function addNewContract(requestStatus, contracts, auction) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS:
            const newContract = addSyntheticProperties(auction.bids[0].contract);
            newContract.bid = auction.bids[0];
            const newContracts = Array.from(contracts.items.values()).map(c => c);
            newContracts.push(newContract);
            return { isFetching: false, items: new Map(newContracts.map(c => [c.id, addSyntheticProperties(c)])) };
    }
}

function* removeOneContract(contracts, work_id) {
    for(let contract of contracts) {
        if(contract.work.id != work_id) {
            yield [contract.id, contract];
        }
    }
}

function removeContract(requestStatus, contracts, work) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: {
            let newContracts = {};
            newContracts[Symbol.iterator] = removeOneContract.bind(null, contracts.items.values(), work.id);
            return { isFetching: false, items: new Map(newContracts) };
        }
    }
}

function updateWorkOnContract(requestStatus, contracts, work) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: {
            const oldContract = Array.from(contracts.items.values()).find(c => c.work.id == work.id);
            const newContract = addSyntheticProperties(Object.assign({}, oldContract, { isFetching: requestStatus == PENDING }));
            newContract.work = work; // this can't be done with Object.assign above because it's using a synthetic property
            const newContracts = Array.from(contracts.items.values()).map(c => c.id == newContract.id ? newContract : c);
            // we probably don't actually need to call addSyntheticProperties again below...TODO: See if that's true
            return { isFetching: false, items: new Map(newContracts.map(c => [c.id, c])) };
        }
    }
}

function handleNewRole(requestStatus, oldContracts, user) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldContracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldContracts, { isFetching: false }); break;
        case SUCCESS: return initialContracts; break;
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
