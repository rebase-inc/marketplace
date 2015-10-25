import React, { Component, PropTypes } from 'react';

import { FindTalentOverview } from './Icons.react';

export default class TalentOverviewPanel extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        return (
            <td className='talentOverviewPanel'>
                <FindTalentOverview auction={auction}/>
            </td>
        );
    }
}
