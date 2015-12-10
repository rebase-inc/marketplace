import ActionConstants from '../constants/ActionConstants';
import ModalConstants from '../constants/ModalConstants';
import { SUCCESS } from '../constants/RequestConstants';

const initialModal = { type: null };

export default function modal(modal = initialModal, action) {
    switch (action.type) {
        case ActionConstants.SELECT_MODAL: return { type: action.response.type };
        case ActionConstants.ADD_SSH_KEY: return handleAddSSHKey(modal, action);
        case ActionConstants.SELECT_VIEW: return initialModal; break;
        case ActionConstants.LOGOUT: return initialModal; break;
        default: return modal; break;
    }
}

function handleAddSSHKey(modal, action) {
    switch (action.status) {
        case SUCCESS: return initialModal;
        default: return modal;
    }
}
