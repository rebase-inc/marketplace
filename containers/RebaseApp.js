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

import { NEW, OFFERED, IN_PROGRESS, COMPLETED, PROFILE, PROJECTS } from '../constants/ViewConstants';

class RebaseApp extends Component {
  render() {
    const { user, view, views, roles, actions } = this.props;
    if (!user.email) {
        return <LoginDialog onLogin={actions.login} />
    } else {
        return (
            <div id='app'>
                <Sidebar user={user} roles={roles} views={views}/>
                {
                    () => {
                        switch (view.type) {
                            case NEW: return <TicketView />; break;
                            case OFFERED: return <AuctionView />; break;
                            case IN_PROGRESS: return <ContractView />; break;
                            case COMPLETED: return <ReviewView />; break;
                            case PROFILE: return <ProfileView />; break;
                            case PROJECTS: return <ProjectView />; break;
                            default: throw 'Invalid view ' + view; break;
                        }
                    }()
                }
            </div>
        );
    }
  }
}

let mapStateToProps = state => ({ user: state.user, roles: state.roles, view: state.view, views: state.views });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(UserActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(RebaseApp);
