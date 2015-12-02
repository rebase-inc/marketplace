import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class TalentPanel extends Component {
    render() {
        const { contractor } = this.props;
        return (
            <td className='talentPanel'>
                <span>{contractor.user.name}</span>
                <RatingStars rating={contractor.rating} />
            </td>
        );
    }
};
