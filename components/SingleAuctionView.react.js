import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AuctionHeader from './AuctionHeader.react';
import Comment from './Comment.react';
import Talent from './Talent.react';
import CommentBox from './CommentBox.react';
import { humanReadableDate } from '../utils/date';
import { getAuctionTicket } from '../utils/getters';

const SHOW_POOR_MATCHES = () => true;
const HIDE_POOR_MATCHES = (nomination) => nomination.job_fit ? (nomination.job_fit.score > 0.6) : false;

export default class SingleAuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = { detailsOpen: false, matchFilter: HIDE_POOR_MATCHES }
    }

    toggleFilter() {
        console.log('toggling');
        this.setState((s) => ({ matchFilter: s.matchFilter == SHOW_POOR_MATCHES ? HIDE_POOR_MATCHES : SHOW_POOR_MATCHES }));
    }

    componentDidUpdate(prevProps) {
        if (this.props.auction.id != prevProps.auction.id) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = 0;
        }
    }

    render() {
        const { user, role, auction, actions } = this.props;
        const ticket = getAuctionTicket(auction);
        const sortedNominations = auction.ticket_set.nominations.sort(sort_nominations);
        const { matchFilter } = this.state;
        return (
            <div className='singleView'>
                <AuctionHeader
                    role={role}
                    auction={auction}
                    openBidModal={actions.openBidModal} />
                <div className='content'>
                    <div className='scrollable'>
                        { ticket.comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnAuction.bind(null, user, ticket)}/>
                    </div>
                    <div className='scrollable talentList'>
                        <div>Suggested Developers</div>
                        { sortedNominations.filter(matchFilter).map(n => <Talent auction={auction} nomination={n} key={n.id} approve={() => actions.approveNomination(auction, n)}/>) }
                        <div onClick={this.toggleFilter}>{ matchFilter == HIDE_POOR_MATCHES ?  'Show Poor Matches' : 'Hide Poor Matches'}</div>
                    </div>
                </div>
            </div>
        );
    }
};

function sort_nominations(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}
