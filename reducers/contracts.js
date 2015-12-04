import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { COMPLETE } from '../constants/WorkStates';
import { compareCommentsByDateAscending } from '../utils/date';

let initialContracts = { items: new Map(), isFetching: false };

function _shouldBeVisible() { return true; }

export default function contracts(contracts = initialContracts, action) {
    let modifiedContract;
    switch (action.type) {
        case ActionConstants.GET_CONTRACTS: return handleGetContracts(contracts, action);
        case ActionConstants.COMMENT_ON_CONTRACT: return handleCommentOnContract(action.status, contracts, action.response.comment || action.response);
        case ActionConstants.BID_ON_AUCTION: return addNewContract(action.status, contracts, action.response.auction);
        case ActionConstants.SUBMIT_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.ACCEPT_WORK: return removeContract(action.status, contracts, action.response.work);
        case ActionConstants.DISPUTE_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_BLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_UNBLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MEDIATION_ANSWER: return updateMediation(action.status, contracts, action.response);
        case ActionConstants.LOGOUT: return initialContracts; break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contracts, action.response.user); break;
        default: return contracts; break;
    }
}

function handleGetContracts(contracts, action) {
    switch (action.status) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: {
            let newContracts = new Map(action.response.contracts.filter(_shouldBeVisible).map(c => [c.id, addSyntheticProperties(c)]));
            return { isFetching: false, items: newContracts };
        }
    }
}

function addNewContract(requestStatus, contracts, auction) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: {
            let winningBid = auction.bids.find(bid => bid.contract);
            if(winningBid !== undefined) {
                const newContract = addSyntheticProperties(winningBid.contract);
                Object.defineProperty(newContract, 'bid', {
                    value: winningBid,
                    configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
                });
                const newContracts = new Map(contracts.items);
                newContracts.set(newContract.id, newContract);
                return { isFetching: false, items: newContracts };
            } else {
                // this bid was not successful
                return contracts;
            }
        }
    }
}

function* removeOneContract(contracts, work_id) {
    for(let contract of contracts) {
        if(contract.work.id != work_id) {
            yield [contract.id, contract];
        }
    }
}

function newContracts(iterator) {
    let _newContracts = {};
    _newContracts[Symbol.iterator] = iterator;
    return { isFetching: false, items: new Map(_newContracts) };
}

function removeContract(requestStatus, contracts, work) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: return newContracts(removeOneContract.bind(null, contracts.items.values(), work.id));
    }
}

function createContract(contract, newWork) {
    const newWorkOffer = Object.assign({}, contract.bid.work_offers[0]);
    newWorkOffer.work = newWork;
    const newBid = Object.assign({}, contract.bid);
    newBid.work_offers = new Array(newWorkOffer);
    const newContract = Object.assign({}, contract);
    newContract.bid = newBid;
    return newContract;
}

function* updateOneWork(contracts, work) {
    for(let contract of contracts) {
        if(contract.work.id == work.id) {
                const newWork = Object.assign({}, work);
                yield [contract.id, addSyntheticProperties(createContract(contract, newWork))];
        } else {
            yield [contract.id, contract];
        }
    }
}

function updateWorkOnContract(requestStatus, contracts, work) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: return newContracts(updateOneWork.bind(null, contracts.items.values(), work));
    }
}

function* updateOneMediation(contracts, mediation) {
    for(let contract of contracts) {
        if(contract.id == mediation.work.offer.bid.contract.id) {
            if(mediation.work.state == COMPLETE) {
                // that effectively removes this contract from the new list of contracts
                continue;
            } else {
                const newWork = Object.assign({}, mediation.work);
                newWork.mediation = mediation;
                yield [contract.id, addSyntheticProperties(createContract(contract, newWork))];
            }
        } else {
            yield [contract.id, contract];
        }
    }
}

function updateMediation(requestStatus, contracts, response) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, contracts, { isFetching: false }); break;
        case SUCCESS: return newContracts(updateOneMediation.bind(null, contracts.items.values(), response.mediation));
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
        get: function() {
            if (!newContract.bid.work_offers[0]) { console.warn('Invalid contract object'); return null; }
            return newContract.bid.work_offers[0].work;
        },
        set: function(work) { newContract.bid.work_offers[0].work = work; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    Object.defineProperty(newContract, 'comments', {
        get: function() {
            let offer = newContract.bid.work_offers[0];
            const comments = offer.ticket_snapshot.ticket.comments.concat(offer.work.comments);
            offer.work.mediations.forEach((mediation) => Array.prototype.push.apply(comments, mediation.comments));
            return comments.sort(compareCommentsByDateAscending);
        },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return newContract;
}

function handleCommentOnContract(requestStatus, contracts, comment) {
    const oldContracts = Array.from(contracts.items.values());
    let modifiedContract = oldContracts.find(c => c.ticket.id == comment.ticket.id);
    switch (requestStatus) {
        case PENDING: modifiedContract = Object.assign({}, modifiedContract, {isFetching: true}); break;
        case ERROR: modifiedContract = Object.assign({}, modifiedContract, {isFetching: false}); break;
        case SUCCESS:
            modifiedContract = addSyntheticProperties(Object.assign({}, modifiedContract, {isFetching: false}));
            modifiedContract.ticket.comments.push(comment);
        break;
    }
    const newContracts = oldContracts.map(c => c.id == modifiedContract.id ? modifiedContract : c);
    return { isFetching: false, items: new Map(newContracts.map(c => [c.id, addSyntheticProperties(c)])) }
}

