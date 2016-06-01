import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ViewTypes } from '../constants/ViewConstants';
import LoginDialog from '../components/LoginDialog.react';
import MainHeader from '../components/MainHeader.react';
import NotificationView from '../components/NotificationView.react';
import ModalView from '../components/ModalView.react';
import MainView from '../components/MainView.react';
import RoleSelectionView from '../components/RoleSelectionView.react';
import SpinningGears from '../components/SpinningGears.react';

import * as UserActions from '../actions/UserActions';
import * as WalkthroughActions from '../actions/WalkthroughActions';

const WalkthroughMask = () => <div className='walkthroughMask'/>;

class Code2ResumeApp extends Component {
    constructor(props, context) {
        super(props, context);
        this.props.actions.restoreC2RSession();
    }
    render() {
        const { user, roleID, walkthrough, view, views, roles, actions, walkthroughActions, githubAccounts } = this.props;
        if (!user.email) {
            if (!user.isFetching) {
                actions.restoreC2RSession();
            }
            return (
                <div id='app'>
                    <SpinningGears />
                </div>
            );
        } else {
            return (
                <div id='app'>
                    { walkthrough.steps.length ? <WalkthroughMask /> : null }
                    <MainHeader user={user} roles={roles} view={view} views={views} walkthrough={walkthrough} actions={actions} walkthroughActions={walkthroughActions} />
                    <ModalView user={user} role={roles.items.get(user.current_role.id)} />
                    <MainView view={view} user={user} roles={roles} actions={actions} walkthrough={walkthrough} walkthroughActions={walkthroughActions} />
                    <NotificationView />
                </div>
            );
        }
    }
}


let mapStateToProps = state => ({
    user: state.user, // need this for just about everything
    roleID: state.roleID, // need this to get the current role from the roles
    roles: state.roles, // need this to get the current role from
    view: state.view, // need to know what view we have selected
    views: state.views, // list of views available
    walkthrough: state.walkthrough,
    githubAccounts: state.githubAccounts // need this to potentially import new projects in RoleSelectionView
});
let mapDispatchToProps = dispatch => ({ 
    actions: bindActionCreators(UserActions, dispatch), 
    walkthroughActions: bindActionCreators(WalkthroughActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Code2ResumeApp);
