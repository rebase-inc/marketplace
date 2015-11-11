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
import DeveloperProfileView from '../components/DeveloperProfileView.react';
import LoginDialog from '../components/LoginDialog.react';
import Sidebar from '../components/Sidebar.react';

import * as UserActions from '../actions/UserActions';

import { NEW, OFFERED, IN_PROGRESS, COMPLETED, PROFILE, PROJECTS, DEVELOPER_PROFILE } from '../constants/ViewConstants';

class RebaseApp extends Component {
  render() {
    const { user, view, views, roles, actions } = this.props;
    if (!user.email) {
        return <LoginDialog isLoading={user.isFetching} onLogin={actions.login} />
    } else {
        return (
            <div id='app'>
                <Sidebar user={user} roles={roles} view={view} views={views} actions={actions}/>
                {
                    () => {
                        switch (view.type) {
                            case NEW: return <TicketView key='ticketView' user={user} roles={roles} />; break;
                            case OFFERED: return <AuctionView key='auctionView' user={user} roles={roles} />; break;
                            case IN_PROGRESS: return <ContractView user={user} roles={roles} />; break;
                            case COMPLETED: return <ReviewView user={user} roles={roles} />; break;
                            case PROFILE:
                                return <ProfileView
                                            updateProfile={actions.updateProfile.bind(null, user)}
                                            uploadPhoto={() => alert('not implemented')}
                                            user={user} roles={roles} />; break;
                            case PROJECTS:
                                return <ProjectView roles={Array.from(roles.items.values())} />; break;
                            case DEVELOPER_PROFILE:
                                return <DeveloperProfileView user={user} contractor={Array.from(roles.items.values()).find(r => r.type == 'contractor')} />; break;
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
