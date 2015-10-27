import React, { Component, PropTypes } from 'react';

import Talent from './Talent.react';

// Maybe this could be done in the auction reducer?
function sort_nominations(n1, n2) {
    return (!!n2.job_fit ? n2.job_fit.score : -1) - (!!n1.job_fit ? n1.job_fit.score : -1)
}

export default class FindTalentView extends Component {
    static propTypes = { auction: PropTypes.object.isRequired }
    render() {
        const { auction } = this.props;
        return (
            <table className='contentList'>
                <tbody>
                    { auction.nominations.sort(sort_nominations).map(talent => <Talent key={talent.id} nomination={talent}/>) }
                </tbody>
            </table>
        );
    }
};
