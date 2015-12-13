import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class ReviewPanel extends Component {
    render() {
        const { review } = this.props;
        return (
            <td className='talentPanel'>
                <span>{review.work.offer.contractor.user.name}</span>
                <RatingStars rating={review.rating/2} />
            </td>
        );
    }
};
