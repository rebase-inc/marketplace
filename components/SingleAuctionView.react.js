import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AuctionHeader from './AuctionHeader.react';
import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import DeveloperPublicProfileView from './DeveloperPublicProfile.react';
import TalentView from './TalentView.react';
import { humanReadableDate } from '../utils/date';
import { getAuctionTicket } from '../utils/getters';

export default class SingleAuctionView extends Component {
    static propTypes = {
        actions:    PropTypes.object.isRequired,
        auction:    PropTypes.object.isRequired,
        role:       PropTypes.object.isRequired,
        user:       PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { selectedNomination: null };
    }

    render() {
        const { user, role, auction, actions } = this.props;
        const selectedNomination = this.state.selectedNomination;
        if (!auction) { return <div className='singleView'> { 'No Auction Selected' } </div>; }
        return (
            <div className='singleView'>
                <AuctionHeader role={role} auction={auction} openBidModal={actions.openBidModal} makeNotification={actions.makeNotification} />
                <div className='content'>
                    <div className='scrollable'>
                        { getAuctionTicket(auction).comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnAuction.bind(null, user, auction)}/>
                    </div>
                    { (!selectedNomination && role.type == 'manager') ? <TalentView
                        nominations={auction.ticket_set.nominations}
                        auction={auction}
                        approve={actions.approveNomination}
                        makeNotification={actions.makeNotification}
                        selectNomination={ (nomination) => this.setState({ selectedNomination: nomination }) }
                    /> : <DeveloperPublicProfileView
                        approve={actions.approveNomination.bind(null, auction, this.state.selectedNomination)}
                        hide={actions.hideNomination.bind(null, auction, this.state.selectedNomination)}
                        nomination={this.state.selectedNomination}
                        closeView={ () => this.setState({ selectedNomination: null }) }
                    /> }
                </div>
            </div>
        );
    }
};
