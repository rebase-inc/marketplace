import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ViewTypes } from '../constants/ViewConstants';
import LoginDialog from '../components/LoginDialog.react';
import MainHeader from '../components/MainHeader.react';
import ModalView from '../components/ModalView.react';
import MainView from '../components/MainView.react';

import * as UserActions from '../actions/UserActions';

class RebaseApp extends Component {
  render() {
    const { user, view, views, roles, actions } = this.props;
    if (!user.email) {
        return <LoginDialog isLoading={user.isFetching} onLogin={actions.login} error={user.error} />
    } else {
        return (
            <div id='app'>
                <MainHeader user={user} roles={roles} view={view} views={views} actions={actions}/>
                <ModalView user={user} roles={roles} />
                <MainView view={view} user={user} roles={roles} />
            </div>
        );
    }
  }
}

let mapStateToProps = state => ({ user: state.user, roles: state.roles, view: state.view, views: state.views });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(UserActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(RebaseApp);
