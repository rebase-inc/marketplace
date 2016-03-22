import React, { Component, PropTypes } from 'react';

import Nomination from './Nomination.react';
import NominationProfile from './NominationProfile.react';

const SHOW_POOR_MATCHES = (nomination) => !nomination.hide;
const HIDE_POOR_MATCHES = (nomination) => ((!nomination.hide) && nomination.job_fit) ? (nomination.job_fit.score > 0.6) || (!!nomination.auction) : false;

export default class NominationView extends Component {
    static propTypes = {
        approve:          PropTypes.func.isRequired,
        auction:          PropTypes.object.isRequired,
        makeNotification: PropTypes.func.isRequired,
        nominations:      PropTypes.array.isRequired,
        selectNomination: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = { filter: HIDE_POOR_MATCHES, sort: _sort }
    }

    toggleFilter() {
        this.setState((s) => ({ filter: s.filter == SHOW_POOR_MATCHES ? HIDE_POOR_MATCHES : SHOW_POOR_MATCHES }));
    }

    _makeNomination(props, nomination) {
        console.log('props are ', props);
        props = {
            key: nomination.contractor.id,
            nomination: nomination,
            auction: props.auction,
            approve: props.approveNomination.bind(null, props.auction, nomination),
            undo: props.makeNotification.bind(null, 'Undo approval not implemented!'),
            select: props.selectNomination.bind(null, nomination)
        }
        return <Nomination {...props} /> ;
    }

    render() {
        const { nomination } = this.state;
        const selectNomination = (nomination) => this.setState({ nomination: nomination });
        const { approveNomination, auction, makeNotification } = this.props;
        const props = Object.assign({}, this.props, { selectNomination: selectNomination });
        if (nomination) {
            return <NominationProfile {...this.props} nomination={nomination} unselect={selectNomination.bind(null, null)} />;
        } else {
            return (
                <div className='scrollable talentList'>
                    <div>Suggested Developers</div>
                    { auction.ticket_set.nominations.filter(this.state.filter).sort(this.state.sort).map(this._makeNomination.bind(null, props)) }
                    <div onClick={this.toggleFilter}>{ this.state.filter == HIDE_POOR_MATCHES ?  'Show Poor Matches' : 'Hide Poor Matches'}</div>
                </div>
            );
        }
    }
}

function _sort(n1, n2) {
    const score1 = !!n1.job_fit ? n1.job_fit.score : 0;
    const score2 = !!n2.job_fit ? n2.job_fit.score : 0;
    return score2 - score1 || n2.contractor.id - n1.contractor.id; // sort by id if the scores are equal
}
