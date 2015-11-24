import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import FindTalentView from './FindTalentView.react';
import DetailsPanel from './DetailsPanel.react';
import {humanReadableDate} from '../utils/date';


export default class SingleAuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
        submitComment: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false, showTalent: props.roles.items.get(props.user.current_role.id).type == 'manager' }
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    render() {
        const { user, roles, auction, unselect, approveNomination, submitComment, openBidModal } = this.props;
        const roleType = roles.items.get(user.current_role.id).type;

        // TODO: refactor this so that TicketHeader and AuctionDetails are in the same component. Current setup doesn't make sense.
        // That would also allow for a more sensical method for closing and opening the AuctionDetails
        // TODO: Deal with all of the states below more cleanly. Probably requires a refactor into multiple components
        // TODO: Only display 'View Talent' button when not showing the FindTalentView
        // TODO: Build components ontop of TicketHeader like AuctionHeader, ContractHeader, etc (and probably rename TicketHeader -> ContentHeader)
        return (
            <div className='contentView'>
                <TicketHeader
                    title={auction.ticket.title}
                    unselect={this.state.showTalent ? () => this.setState({ showTalent: false }) : unselect}
                    toggleDetails={this.toggleDetails}>
                    { roleType == 'developer' ? <button onClick={openBidModal}>Bid Now</button> : null }
                    { roleType == 'manager' && !this.state.showTalent ? <button onClick={() => this.setState({ showTalent: true })}>View Developers</button> : null }
                </TicketHeader>
                <DetailsPanel
                    hidden={!this.state.detailsOpen}
                    ticket={auction.ticket}
                    clone={auction.ticket.project.work_repo.clone}
                    >
                    <span>{'Finish work by '+humanReadableDate(auction.finish_work_by)}</span>
                </DetailsPanel>
                { this.state.showTalent ? <FindTalentView auction={auction} approveNomination={approveNomination} /> : null }
                { this.state.showTalent ? null : <CommentList comments={auction.ticket.comments}/> }
                { this.state.showTalent ? null : <CommentBox submit={submitComment} /> }
            </div>
        );
    }
};
