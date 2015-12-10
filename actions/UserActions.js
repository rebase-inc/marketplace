import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';
import { ADD_SSH_KEY_MODAL } from '../constants/ModalConstants';

export function logout() {
    return dispatchedRequest('DELETE', '/auth', ActionConstants.LOGOUT);
}

export function restoreSession() {
    return dispatchedRequest('GET', '/auth', ActionConstants.LOGIN);
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

export function loadCookieData() {
    console.log('the cookie we got is ', Cookies.get('user'));
    return {
        type: ActionConstants.LOAD_COOKIE_DATA,
        response: { user: Cookies.get('user') },
        status: SUCCESS,
    }
}

export function closeModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { modalType: null },
        status: SUCCESS
    }
}

export function updateProfile(user, settings) {
    const url = '/users/' + user.id;
    const data = Object.assign(settings, { id: user.id });
    return dispatchedRequest('PUT', url, ActionConstants.UPDATE_PROFILE, data);
}

export function addSSHKey(user, key, title) {
    const data = { key: key, title: title, user: { id: user.id } };
    return dispatchedRequest('POST', '/ssh_keys', ActionConstants.ADD_SSH_KEY, data);
}

export function selectRole(user, roleId) {
    const data = { id: user.id, current_role: { id: roleId }};
    const url = '/users/' + user.id;
    return dispatchedRequest('PUT', url, ActionConstants.SELECT_ROLE, data);
}

export function openAddSSHKeyModal() {
    return {
        type: ActionConstants.SELECT_MODAL,
        response: { type: ADD_SSH_KEY_MODAL },
        status: SUCCESS
    }
}
