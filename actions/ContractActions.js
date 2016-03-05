import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';
import { SUBMIT_WORK_MODAL, ACCEPT_WORK_MODAL, DISPUTE_WORK_MODAL, BLOCK_WORK_MODAL, UNBLOCK_WORK_MODAL, RESOLVE_MEDIATION_MODAL } from '../constants/ModalConstants';
import { getContractTicket } from '../utils/getters';

export function getContracts() {
    return (dispatch, getState) => (!!getState().contracts.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/contracts', ActionConstants.GET_CONTRACTS));
}

export function selectContract(contractId) {
    return {
        type: ActionConstants.SELECT_CONTRACT,
        response: { contractId: contractId },
        status: SUCCESS
    }
}

export function submitWork(work, comment) {
    const url = '/works/' + work.id + '/review';
    const data = { comment: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.SUBMIT_WORK, data);
}

export function disputeWork(work, comment) {
    const url = '/works/' + work.id + '/mediate';
    const data = { comment: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.DISPUTE_WORK, data);
}

export function acceptWork(work, contractId, contracts, comment, rating) {
    const url = '/works/' + work.id + '/complete';
    const data = { comment: comment, work: work, rating: rating };
    const otherContracts = contracts.filter( (c) => c.id != contractId );
    const context = { nextSelectedContractId: (otherContracts.length > 0) ? otherContracts[0].id : null }
    return dispatchedRequest('POST', url, ActionConstants.ACCEPT_WORK, data, true, context);
}

export function markWorkBlocked(work, comment) {
    const url = '/works/' + work.id + '/halt';
    const data = { comment: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.MARK_WORK_BLOCKED, data);
}

export function markWorkUnblocked(work, comment) {
    const url = '/works/' + work.id + '/resolve';
    const data = { comment: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.MARK_WORK_UNBLOCKED, data);
}

export function openSubmitWorkModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: SUBMIT_WORK_MODAL },
        status: SUCCESS
    }
}

export function openAcceptWorkModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: ACCEPT_WORK_MODAL },
        status: SUCCESS
    }
}

export function openDisputeWorkModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: DISPUTE_WORK_MODAL },
        status: SUCCESS
    }
}

export function openBlockWorkModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: BLOCK_WORK_MODAL },
        status: SUCCESS
    }
}

export function openUnblockWorkModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: UNBLOCK_WORK_MODAL },
        status: SUCCESS
    }
}

export function openResolveMediationModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: RESOLVE_MEDIATION_MODAL },
        status: SUCCESS
    }
}

// this is intentionally duplicated because as far as react is concerned it is a different
// action than commenting on a ticket, contract, review, etc.
export function commentOnContract(user, contract, text) {
    const ticket = getContractTicket(contract);
    const data = {
        user: { id: user.id, name: user.name }, // We need this for now, until the api is fixed
        ticket: {id: ticket.id},
        content: text
    };
    return dispatchedRequest('POST', '/comments', ActionConstants.COMMENT_ON_CONTRACT, data);
}

export function sendMediationAnswer(roleType, contractId, mediationIndex, mediation, answer, comment) {
    const url = '/mediations/' + mediation.id + '/'+ (roleType == 'manager' ? 'client_answer' : 'dev_answer'); 
    const data = {
        answer: answer,
        comment: comment
    };
    const context = {
        contractId: contractId,
    };
    return dispatchedRequest('POST', url, ActionConstants.MEDIATION_ANSWER, data, true, context);
};
