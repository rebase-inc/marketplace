import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function logout() {
    return dispatchedRequest('GET', '/auth', ActionConstants.LOGOUT);
}

export function login(email, password) {
    let data = { user: { email: email }, password: password, };
    return dispatchedRequest('POST', '/auth', ActionConstants.LOGIN, data);
}

export function selectView(viewType) {
    return {
        type: ActionConstants.SELECT_VIEW,
        response: { viewType },
        status: SUCCESS
    }
}

export function uploadProfilePhoto(fileBlob) {
    var data = new FormData();
    data.append('photo', fileBlob);
    return dispatchedRequest('POST', '/uploads', ActionConstants.UPLOAD_PHOTO, data, false); 
}

export function closeModal(viewType) {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { modalType: null , viewType: viewType},
        status: SUCCESS
    }
}

export function updateProfile(user, settings) {
    const url = '/users/' + user.id;
    const data = Object.assign(settings, { id: user.id });
    return dispatchedRequest('PUT', url, ActionConstants.UPDATE_PROFILE, data);
}

export function selectRole(user, roleId) {
    const data = { id: user.id, current_role: { id: roleId }};
    const url = '/users/' + user.id;
    return dispatchedRequest('PUT', url, ActionConstants.SELECT_ROLE, data);
}
