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

export function updateProfile(user, settings) {
    const url = '/users/' + user.id;
    const data = Object.assign(settings, { id: user.id });
    return dispatchedRequest('PUT', url, ActionConstants.UPDATE_PROFILE, data);
}


//module.exports = {
    ////login: function(email, password) {
        ////let actionType = ActionConstants.LOGIN;
        ////let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        ////let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        ////Api.login(email, password, responseAction, pendingAction);
    ////},
    //login: function addTodo(email) {
      //return {
        //type: ActionConstants.LOGIN,
        //user: { email: email },
      //};
    //},
    //logout: function() {
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.LOGOUT,
                //status: status,
                //response: response
            //});
        //};
        //var pendingAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.LOGOUT,
                //response: RequestConstants.PENDING,
            //});
        //};
        //Api.logout(responseAction, pendingAction);
    //},
    //authenticateGithub: function() {
        //function responseAction(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.AUTHENTICATE_GITHUB,
                //status: status,
                //response: response
            //});
        //};
        //function pendingAction() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.AUTHENTICATE_GITHUB,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.authenticateGithub(responseAction, pendingAction);
    //},
    //getUserDetail: function(userID) {
        //var actionType = ActionConstants.GET_USER_DETAIL;
        //let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        //let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //Api.getUserDetail(userID, responseAction, pendingAction);
    //},
    //updateUserSettings: function(user) {
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_USER_SETTINGS,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_USER_SETTINGS,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.updateUserSettings(user, responseHandler, pendingHandler);
    //},
    //updateProfilePhoto: function(file) {
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_PROFILE_PHOTO,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_PROFILE_PHOTO,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.updateProfilePhoto(file, responseHandler, pendingHandler);
    //},
    //selectRole: function(user, role_id) {
        //if (typeof(user) != 'object' || typeof(role_id) != 'number') {
            //throw 'Invalid types for user and role_id: ' + typeof(user) + ' and ' + typeof(role_id);
        //}
        //let actionType = ActionConstants.SELECT_ROLE;
        //let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        //let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //Api.updateUserSettings({ id: user.id, current_role: { id: role_id } }, responseAction, pendingAction);
    //},
//};



