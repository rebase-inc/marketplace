import React, { Component, PropTypes } from 'react';

import TicketView from './TicketView.react';
import AuctionView from './AuctionView.react';
import ContractView from './ContractView.react';
import ReviewView from './ReviewView.react';
import ProfileView from './ProfileView.react';
import ProjectView from './ProjectView.react';
import DeveloperProfileView from './DeveloperProfileView.react';

export default class MainContent extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
    }

    render() {
        const { user, roles, actions } = this.props;
        switch (view.type) {
            case NEW: 
                return <TicketView key='ticketView' user={user} roles={roles} />; break;
            case OFFERED: 
                return <AuctionView key='auctionView' user={user} roles={roles} />; break;
            case IN_PROGRESS: 
                return <ContractView user={user} roles={roles} />; break;
            case COMPLETED: 
                return <ReviewView user={user} roles={roles} />; break;
            case PROFILE:
                return <ProfileView user={user} roles={roles} 
                            updateProfile={actions.updateProfile.bind(null, user)}
                            uploadPhoto={() => alert('not implemented')} />; break;
            case PROJECTS:
                return <ProjectView roles={Array.from(roles.items.values())} />; break;
            case DEVELOPER_PROFILE:
                return <DeveloperProfileView user={user} contractor={Array.from(roles.items.values()).find(r => r.type == 'contractor')} />; break;
        }
    }
}
