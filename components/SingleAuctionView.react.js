import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AuctionHeader from './AuctionHeader.react';
import Comment from './Comment.react';
import Talent from './Talent.react';
import CommentBox from './CommentBox.react';
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

    componentDidUpdate(prevProps) {
        if (this.props.auction.id != prevProps.auction.id) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = 0;
        }
    }

    render() {
        const { user, role, auction, actions } = this.props;
        const ticket = getAuctionTicket(auction);
        const unselect = this.state.showTalent ? () => this.setState({ showTalent: false }) : actions.selectAuction.bind(null, null);
        const sortedNominations = auction.ticket_set.nominations.sort(sort_nominations);
        const { showTalent } = this.state;
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
                        { sortedNominations.map(n => <Talent auction={auction} nomination={n} key={n.id} approve={() => actions.approveNomination(auction, n)}/>) }
                    </div>
                </div>
            </div>
        );
    }
};

function sort_nominations(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}
