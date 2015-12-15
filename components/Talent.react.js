import React, { Component, PropTypes } from 'react';

import TalentPanel from './TalentPanel.react';
import TalentScore from './TalentScore.react';
import ProfilePicture from './ProfilePicture.react';
import RatingStars from './RatingStars.react';
import ApproveTalentIcon from './ApproveTalentIcon.react';

export default class Talent extends Component {
    static propTypes = { nomination: PropTypes.object.isRequired, }
    render() {
        const { nomination, approve, auction } = this.props;
        const rating = nomination.contractor.rating ? nomination.contractor.rating / 2 : null;
        return (
            <div className='talent'>
                <TalentScore score={nomination.job_fit ? nomination.job_fit.score : -0.1} />
                <ProfilePicture user={nomination.contractor.user} />
                <div className='mainInfo'>
                    <span>{ nomination.contractor.user.name }</span>
                    <RatingStars rating={rating} />
                    { Object.keys(nomination.contractor.skill_set.skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
                <ApproveTalentIcon approve={approve} auction={auction} nomination={nomination} />
            </div>
        );
    }
};
