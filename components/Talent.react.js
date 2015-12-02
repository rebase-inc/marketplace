import React, { Component, PropTypes } from 'react';

import TalentPanel from './TalentPanel.react';
import TalentScore from './TalentScore.react';
import ApproveTalentIcon from './ApproveTalentIcon.react';

export default class Talent extends Component {
    static propTypes = { nomination: PropTypes.object.isRequired, }
    render() {
        const { nomination, approve, auction } = this.props;

        // TODO: Abstract out each of these panels
        return (
            <tr className='nomination'>
                <td className='actionPanel'>
                    <ApproveTalentIcon approve={approve} auction={auction} nomination={nomination} />
                </td>
                <TalentPanel contractor={nomination.contractor} />
                <td className='skillSetPanel'>
                    <div className='skills'>
                        { Object.keys(nomination.contractor.skill_set.skills).map((skill) =>
                           <div key={skill} className='skill'>{skill}</div>) }
                    </div>
                </td>
                <td className='scorePanel'>
                    <TalentScore score={nomination.job_fit ? nomination.job_fit.score : -0.1} />
                </td>
            </tr>
        );
    }
};
