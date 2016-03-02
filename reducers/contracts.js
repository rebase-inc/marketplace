import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { COMPLETE } from '../constants/WorkStates';
import { getContractTicket } from '../utils/getters';

const initialContracts = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

// hack to only show not completed contracts. This really should be handled by the api
function _shouldBeVisible(contract) {
    return contract.bid.work_offers[0].work.state != COMPLETE;
}

export default function contracts(contracts = initialContracts, action) {
    switch (action.type) {
        case ActionConstants.GET_CONTRACTS: return handleNewContracts(action.status, contracts, action.response.contracts); break;
        case ActionConstants.COMMENT_ON_CONTRACT: return handleCommentOnContract(action.status, contracts, action.response.comment || action.response);
        case ActionConstants.BID_ON_AUCTION: return handleBidOnAuction(action.status, contracts, action.response.auction);
        case ActionConstants.SUBMIT_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.DISPUTE_WORK: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_BLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.MARK_WORK_UNBLOCKED: return updateWorkOnContract(action.status, contracts, action.response.work);
        case ActionConstants.ACCEPT_WORK: return removeContractByWork(action.status, contracts, action.response.work);
        case ActionConstants.MEDIATION_ANSWER: return updateMediationOnContract(action.status, contracts, action);
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contracts, action.response.user); break;
        case ActionConstants.LOGOUT: return initialContracts; break;
        default: return contracts; break;
    }
}

function handleNewContracts(requestStatus, contracts, newContracts) {
    switch (requestStatus) {
        case PENDING: return contracts.set('isFetching', true); break;
        case ERROR: return contracts.set('isFetching', false); break;
        case SUCCESS: {
            return new Immutable.Record({
                items: Immutable.OrderedMap(newContracts.filter(_shouldBeVisible).map(c => [c.id, Immutable.fromJS(c)])),
                isFetching: false
            })();
        }
    }
}

function handleBidOnAuction(requestStatus, contracts, auction) {
    switch (requestStatus) {
        case PENDING: return contracts.set('isFetching', true); break;
        case ERROR: return contracts.set('isFetching', false); break;
        case SUCCESS:
            const winningBid = auction.bids.find(bid => bid.contract);
            if (!!winningBid) {
                const contract = Immutable.Map(winningBid.contract);
                return contracts.mergeDeepIn(['items', contract.get('id')], contract).mergeDeepIn(['items', contract.get('id'), 'bid'], winningBid);
            } else {
                return contracts;
            }
            break;
    }
}

function removeContractByWork(requestStatus, contracts, work) {
    switch (requestStatus) {
        case PENDING: return contracts.set('isFetching', true); break;
        case ERROR: return contracts.set('isFetching', false); break;
        case SUCCESS:
            const contractId = contracts.items.findKey(c => c.getIn(['bid', 'work_offers', 0, 'work','id']) == work.id);
            return contracts.deleteIn(['items', contractId]).set('isFetching', false);
            break;
    }
}

function updateWorkOnContract(requestStatus, contracts, work) {
    const contractId = contracts.items.findKey(c => c.getIn(['bid', 'work_offers', 0, 'work', 'id']) == work.id);
    switch (requestStatus) {
        case PENDING: return contracts.setIn(['items', contractId, 'bid', 'work_offers', 0, 'work', 'isFetching'], true);
        case ERROR: return contracts.set(['items', contractId, 'bid', 'work_offers', 0, 'work', 'isFetching'], false);
        case SUCCESS: return contracts.mergeDeepIn(['items', contractId, 'bid', 'work_offers', 0, 'work'], work, { isFetching: false });
    }
}

function updateMediationOnContract(requestStatus, contracts, action) {
    console.log('updateMediation, action: %o', action)
    const contractId = action.context.work.offer.bid.contract.id;
    switch (requestStatus) {
        case PENDING: return contracts.setIn(['items', contractId, 'bid', 'work_offers', 0, 'work', 'mediation', 'isFetching'], true);
        case ERROR: return contracts.setIn(['items', contractId, 'bid', 'work_offers', 0, 'work', 'mediation', 'isFetching'], false);
        case SUCCESS: return contracts.mergeDeepIn(
            ['items', contractId, 'bid', 'work_offers', 0, 'work', 'mediations', action.context.mediation_index],
            mediation,
            { isFetching: false }
        );
    }
}

function handleNewRole(requestStatus, contracts, user) {
    switch (requestStatus) {
        case PENDING: return contracts.set('isFetching', true);
        case ERROR: return contracts.set('isFetching', false);
        case SUCCESS: return initialContracts;
    }
}

function handleCommentOnContract(requestStatus, contracts, comment) {
    // "contract" comments really go on the ticket...but that probably should be changed
    const contractId = contracts.get('items').findKey(c => getContractTicket(c.toJS()).id == comment.ticket.id);
    const commentKeyPath = ['items', contractId, 'bid', 'work_offers', 0, 'ticket_snapshot', 'ticket', 'comments'];
    const commentIndex = contracts.getIn(commentKeyPath).findIndex(c => c.content == comment.content);
    switch (requestStatus) {
        case PENDING:
            comment = Immutable.Map(comment).set('isFetching', true);
            return contracts.updateIn(commentKeyPath, comments => comments.push(comment));
        case ERROR:
            return contracts.deleteIn(commentKeyPath.concat(commentIndex));
        case SUCCESS:
            return contracts.mergeIn(commentKeyPath.concat(commentIndex), comment, { isFetching: false });
    }
}
