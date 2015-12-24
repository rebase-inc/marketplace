import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ViewTypes } from '../constants/ViewConstants';
import LoginDialog from '../components/LoginDialog.react';
import MainHeader from '../components/MainHeader.react';
import ModalView from '../components/ModalView.react';
import MainView from '../components/MainView.react';
import RoleSelectionView from '../components/RoleSelectionView.react';

import * as UserActions from '../actions/UserActions';

class RebaseApp extends Component {
    constructor(props, context) {
        super(props, context);
        this.props.actions.restoreSession();
    }
    render() {
        const { user, roleID, view, views, roles, actions } = this.props;
        if (!user.email) {
            return <LoginDialog isLoading={user.isFetching} onLogin={actions.login} error={user.error} />
        } else if (!roleID) {
            return <RoleSelectionView roles={Array.from(roles.items.values())} select={actions.selectRole.bind(null, user)} />
        } else {
            return (
                <div id='app'>
                    <MainHeader user={user} roles={roles} view={view} views={views} actions={actions}/>
                    <ModalView user={user} role={roles.items.get(user.current_role.id)} />
                    <MainView view={view} user={user} roles={roles} actions={actions}/>
                </div>
            );
        }
    }
}

let mapStateToProps = state => ({ user: state.user, roleID: state.roleID, roles: state.roles, view: state.view, views: state.views });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(UserActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(RebaseApp);
