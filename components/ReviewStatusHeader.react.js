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
            <div id='statusHeader'
                data-neutral={undefined}
                data-notification={undefined}
                data-okay={true}
                data-alert={undefined}
                data-warning={undefined} >
                { statusText }
            </div>
        );
    }
}
