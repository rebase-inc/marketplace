import React, { Component, PropTypes } from 'react';
import Months from '../constants/Months';

export default class AuctionPanel extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        let finishString = (date) => { return 'Finish work by ' + Months[date.getMonth()] + ' ' + date.getDate(); }(new Date(auction.finish_work_by));
        return (
            <span>{finishString}</span>
        );
    }
};
