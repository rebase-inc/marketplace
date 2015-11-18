import ActionConstants from '../constants/ActionConstants';
import ModalConstants from '../constants/ModalConstants';

const initialModal = { type: null };

export default function modal(modal = initialModal, action) {
    switch (action.type) {
        case ActionConstants.SELECT_MODAL: {
            return { type: action.response.type };
        }
        case ActionConstants.SELECT_VIEW: return initialModal; break;
        case ActionConstants.LOGOUT: return initialModal; break;
        default: return modal; break;
    }
}
