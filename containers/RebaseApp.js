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
import * as WalkthroughActions from '../actions/WalkthroughActions';

const WalkthroughMask = () => <div className='walkthroughMask'/>;

class RebaseApp extends Component {
    constructor(props, context) {
        super(props, context);
        this.props.actions.restoreSession();
    }
    render() {
        const { user, roleID, walkthrough, view, views, roles, actions, walkthroughActions, githubAccounts } = this.props;
        if (!user.email) {
            return <LoginDialog isLoading={user.isFetching} onLogin={actions.login} error={user.error} />
        } else if (!roleID) {
            return <RoleSelectionView user={user} roles={Array.from(roles.items.values())} select={actions.selectRole.bind(null, user)} githubAccounts={Array.from(githubAccounts.items.values())} />
        } else {
            return (
                <div id='app'>
                    { walkthrough.steps.length ? <WalkthroughMask /> : null }
                    <MainHeader user={user} roles={roles} view={view} views={views} walkthrough={walkthrough} actions={actions} walkthroughActions={walkthroughActions} />
                    <ModalView user={user} role={roles.items.get(user.current_role.id)} />
                    <MainView view={view} user={user} roles={roles} actions={actions}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(RebaseApp);
