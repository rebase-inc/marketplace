import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';
import { SUBMIT_WORK_MODAL, ACCEPT_WORK_MODAL, DISPUTE_WORK_MODAL, BLOCK_WORK_MODAL, UNBLOCK_WORK_MODAL, RESOLVE_MEDIATION_MODAL } from '../constants/ModalConstants';

export function getContracts() {
    return (dispatch, getState) => (!!getState().auctions.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/contracts', ActionConstants.GET_CONTRACTS));
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
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.SUBMIT_WORK, data);
}

export function disputeWork(work, comment) {
    const url = '/works/' + work.id + '/mediate';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.DISPUTE_WORK, data);
}

export function acceptWork(work, comment) {
    const url = '/works/' + work.id + '/complete';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.ACCEPT_WORK, data);
}

export function markWorkBlocked(work, comment) {
    const url = '/works/' + work.id + '/halt';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.MARK_WORK_BLOCKED, data);
}

export function markWorkUnblocked(work, comment) {
    const url = '/works/' + work.id + '/resume';
    const data = { reason: comment, work: work };
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
