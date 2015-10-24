import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ViewTypes } from '../constants/ViewConstants';

import TicketView from '../components/TicketView.react';
import AuctionView from '../components/AuctionView.react';
import ContractView from '../components/ContractView.react';
import ReviewView from '../components/ReviewView.react';
import ProfileView from '../components/ProfileView.react';
import ProjectView from '../components/ProjectView.react';
import LoginDialog from '../components/LoginDialog.react';
import Sidebar from '../components/Sidebar.react';

import * as UserActions from '../actions/UserActions';

class RebaseApp extends Component {
  render() {
    const { user, view, roles, actions } = this.props;
    console.log('in rebase app, this.props is ', this.props);
    if (!user.email) {
        return <LoginDialog onLogin={actions.login} />
    } else {
        return (
            <div id='app'>
                <Sidebar user={user} roles={roles}/>
                {
                    () => { return null;
                        switch (view.type) {
                            case viewConstants.ViewTypes.NEW: return <TicketView />; break;
                            case viewConstants.ViewTypes.OFFERED: return <AuctionView />; break;
                            case viewConstants.ViewTypes.IN_PROGRESS: return <ContractView />; break;
                            case viewConstants.ViewTypes.COMPLETED: return <ReviewView />; break;
                            case viewConstants.ViewTypes.PROFILE: return <ProfileView />; break;
                            case viewConstants.ViewTypes.PROJECTS: return <ProjectView />; break;
                            default: throw 'Invalid view ' + view; break;
                        }
                    }
                }
            </div>
        );
    }
  }
}

let mapStateToProps = state => ({ user: state.user, roles: state.roles, view: state.view }); 
let mapDispatch = dispatch => ({ actions: bindActionCreators(UserActions, dispatch)});
export default connect(mapStateToProps, mapDispatch)(RebaseApp);
