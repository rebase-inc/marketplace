import React, { Component, PropTypes } from 'react';

import TicketView from './TicketView.react';
import AuctionView from './AuctionView.react';
import ContractView from './ContractView.react';
import ReviewView from './ReviewView.react';
import ProfileView from './ProfileView.react';
import ProjectView from './ProjectView.react';
import DeveloperProfileView from './DeveloperProfileView.react';
import BillingAndPaymentView from './BillingAndPaymentView.react';

import { NEW, OFFERED, IN_PROGRESS, COMPLETED, PROFILE, PROJECTS, DEVELOPER_PROFILE, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';

export default class MainView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { user, view, roles, actions, walkthrough, walkthroughActions } = this.props;
        const role = roles.items.get(user.current_role.id);
        const props = { user, role, walkthrough, walkthroughActions, selectView: actions.selectView };
        switch (view.type) {
            case NEW: return <TicketView key='ticketView' {...props} />; break;
            case OFFERED: return <AuctionView key='auctionView' {...props} />; break;
            case IN_PROGRESS: return <ContractView {...props} />; break;
            case COMPLETED: return <ReviewView {...props} />; break;
            case PROFILE:
                return <ProfileView user={user}
                    roles={roles}
                    logout={actions.logout}
                    openAddSSHKeyModal={actions.openAddSSHKeyModal}
                    updateProfile={actions.updateProfile.bind(null, user)}
                    uploadPhoto={actions.uploadProfilePhoto} />;
                    break;
            case PROJECTS:
                return <ProjectView roles={Array.from(roles.items.values())} />; break;
            case DEVELOPER_PROFILE:
                return <DeveloperProfileView user={user} contractor={Array.from(roles.items.values()).find(r => r.type == 'contractor')} />; break;
            case BILLING_AND_PAYMENTS:
                return <BillingAndPaymentView user={user} role={role} selectView={actions.selectView}/>; break;
            default:
                let warn = (console.warn || console.log).bind(console);
                warn('Invalid view ' + view.type); return null;
        }
    }
}
