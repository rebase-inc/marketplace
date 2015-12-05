import React, { Component, PropTypes } from 'react';

import Talent from './Talent.react';

// Maybe this could be done in the auction reducer?
function sort_nominations(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}

export default class FindTalentView extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
        approve: PropTypes.func.isRequired
    }
    render() {
        const { auction, approve } = this.props;
        const sortedNominations = auction.ticket_set.nominations.sort(sort_nominations);
        return (
            <table className='contentList'>
                <tbody>
                    { sortedNominations.map(n => <Talent auction={auction} nomination={n} key={n.id} approve={() => approve(auction, n)}/>) }
                </tbody>
            </table>
        );
    }
};
