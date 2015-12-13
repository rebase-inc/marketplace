import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class TalentPanel extends Component {
    render() {
        const { contractor } = this.props;
        const rating = contractor.rating ? contractor.rating / 2 : null;
        return (
            <td className='talentPanel'>
                <span>{contractor.user.name}</span>
                <RatingStars rating={rating} />
            </td>
        );
    }
};
