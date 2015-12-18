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
                <AuctionHeader ticket={ticket} role={role}>
                    { role.type == 'contractor' ? <button onClick={actions.openBidModal}>Bid Now</button> : null }
                    { role.type == 'manager' ?
                        <button onClick={() => this.setState({ showTalent: !showTalent })}>
                            { showTalent ? 'View Details' : 'View Developers' }
                        </button> : null }
                </AuctionHeader>
                { this.state.showTalent ?
                    sortedNominations.map(n => <Talent auction={auction} nomination={n} key={n.id} approve={() => actions.approveNomination(auction, n)}/>) : null }
                { !this.state.showTalent ?
                    ticket.comments.map( comment => <Comment comment={comment} key={comment.id} /> ) : null }
                { !this.state.showTalent ? <CommentBox submit={actions.commentOnAuction.bind(null, user, ticket)}/> : null }
            </div>
        );
    }
};

function sort_nominations(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}
