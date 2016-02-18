import React, { Component, PropTypes } from 'react';

import Talent from './Talent.react';

const SHOW_POOR_MATCHES = () => true;
const HIDE_POOR_MATCHES = (nomination) => nomination.job_fit ? (nomination.job_fit.score > 0.6) : false;

export default class TalentView extends Component {
    constructor(props, context) {
        super(props, context);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = { matchFilter: HIDE_POOR_MATCHES }
    }

    toggleFilter() {
        this.setState((s) => ({ matchFilter: s.matchFilter == SHOW_POOR_MATCHES ? HIDE_POOR_MATCHES : SHOW_POOR_MATCHES }));
    }

    render() {
        const { nominations, auction, approve } = this.props;
        const { matchFilter } = this.state;
        return (
            <div className='scrollable talentList'>
                <div>Suggested Developers</div>
                { nominations.sort(_sort).filter(matchFilter).map(n => <Talent auction={auction} nomination={n} key={n.id} approve={approve.bind(null, auction, n)}/>) }
                <div onClick={this.toggleFilter}>{ matchFilter == HIDE_POOR_MATCHES ?  'Show Poor Matches' : 'Hide Poor Matches'}</div>
            </div>
        );
    }
}

function _sort(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}
