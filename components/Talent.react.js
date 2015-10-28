import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';
import { ApproveTalent, TalentScore } from './Icons.react';

export default class Talent extends Component {
    static propTypes = { nomination: PropTypes.object.isRequired, }
    render() {
        const { nomination, approve, auction } = this.props;

        // TODO: Abstract out each of these panels
        return (
            <tr className='nomination'>
                <td className='actionPanel' onClick={approve}>
                    <ApproveTalent auction={auction} nomination={nomination} />
                </td>
                <td className='talentPanel'>
                    <span>{nomination.contractor.user.first_name + ' ' + nomination.contractor.user.last_name}</span>
                    <RatingStars rating={nomination.contractor.rating} />
                </td>
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
