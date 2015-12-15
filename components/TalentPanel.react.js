import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';
import ProfilePicture from './ProfilePicture.react';

export default class TalentPanel extends Component {
    render() {
        const { contractor } = this.props;
        const rating = contractor.rating ? contractor.rating / 2 : null;
        return (
            <td className='talentPanel'>
                <ProfilePicture user={contractor.user} />
                <span>{contractor.user.name}</span>
                <RatingStars rating={rating} />
            </td>
        );
    }
};
