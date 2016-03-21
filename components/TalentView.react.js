import React, { Component, PropTypes } from 'react';

import Talent from './Talent.react';

const SHOW_POOR_MATCHES = (nomination) => !nomination.hide;
const HIDE_POOR_MATCHES = (nomination) => ((!nomination.hide) && nomination.job_fit) ? (nomination.job_fit.score > 0.6) : false;

export default class TalentView extends Component {
    static propTypes = {
        approve:            PropTypes.func.isRequired,
        auction:            PropTypes.object.isRequired,
        makeNotification:   PropTypes.func.isRequired,
        nominations:        PropTypes.array.isRequired,
        selectNomination:   PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = { matchFilter: HIDE_POOR_MATCHES }
    }

    toggleFilter() {
        this.setState((s) => ({ matchFilter: s.matchFilter == SHOW_POOR_MATCHES ? HIDE_POOR_MATCHES : SHOW_POOR_MATCHES }));
    }

    render() {
        const { approve, auction, makeNotification, nominations, selectNomination } = this.props;
        const { matchFilter } = this.state;
        return (
            <div className='scrollable talentList'>
                <div>Suggested Developers</div>
                { nominations.filter(matchFilter).sort(_sort).map(n => <Talent
                                                                  auction={auction}
                                                                  nomination={n}
                                                                  key={n.contractor.id.toString()+'/'+n.ticket_set.id.toString()}
                                                                  approve={approve.bind(null, auction, n)}
                                                                  undo={makeNotification.bind(null, 'Not implemented!!')}
                                                                  select={selectNomination.bind(null, n)}
                                                                  />) }
                <div onClick={this.toggleFilter}>{ matchFilter == HIDE_POOR_MATCHES ?  'Show Poor Matches' : 'Hide Poor Matches'}</div>
            </div>
        );
    }
}

function _sort(n1, n2) {
    const score1 = !!n1.job_fit ? n1.job_fit.score : 0;
    const score2 = !!n2.job_fit ? n2.job_fit.score : 0;
    return score2 - score1 || n2.contractor.id - n1.contractor.id; // sort by id if the scores are equal
}
