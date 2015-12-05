import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import FindTalentView from './FindTalentView.react';
import DetailsPanel from './DetailsPanel.react';
import { humanReadableDate } from '../utils/date';
import { getAuctionTicket } from '../utils/getters';

export default class SingleAuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false, showTalent: props.role.type == 'manager' }
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
        const { user, role, auction, actions } = this.props;
        const ticket = getAuctionTicket(auction);
        const unselect = this.state.showTalent ? () => this.setState({ showTalent: false }) : actions.selectAuction.bind(null, null);
        return (
            <div className='contentView'>
                <TicketHeader unselect={unselect} title={ticket.title} toggleDetails={this.toggleDetails}>
                    { role.type == 'contractor' ? <button onClick={actions.openBidModal}>Bid Now</button> : null }
                    { (role.type == 'manager' && !this.state.showTalent) ? <button onClick={() => this.setState({ showTalent: true })}>View Developers</button> : null }
                </TicketHeader>
                <DetailsPanel hidden={!this.state.detailsOpen} ticket={ticket} clone={ticket.project.work_repo.clone} >
                    <span>{ 'Finish work by ' + humanReadableDate(auction.finish_work_by) }</span>
                </DetailsPanel>
                { this.state.showTalent ? <FindTalentView auction={auction} approve={actions.approveNomination} /> : null }
                { this.state.showTalent ? null : <CommentList comments={ticket.comments}/> }
                { this.state.showTalent ? null : <CommentBox submit={actions.commentOnAuction.bind(null, user, auction)} /> }
            </div>
        );
    }
};
