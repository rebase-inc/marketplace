import React, { Component, PropTypes } from 'react';

import { humanReadableDate } from '../utils/date';

export default class ReviewStatusHeader extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }

    render() {
        const { review, role } = this.props;
        let statusText = '';
        statusText += 'Completed by ';
        statusText += role.type == 'manager' ? review.work.offer.contractor.user.name : 'you';;
        statusText += '. ';
        statusText += 'Finished on ';
        statusText += humanReadableDate(review.created);
        statusText += '.';
        return (
            <div className='status'
                data-neutral={undefined}
                data-notification={undefined}
                data-okay={true}
                data-alert={undefined}
                data-warning={undefined} >
                <svg height='12px' width='12px' viewBox='0 0 12 12'>
                    <circle cx='6' cy='6' r='6'/>
                </svg>
                <span>{statusText}</span>
            </div>
        );
    }
}
