import React, { Component, PropTypes } from 'react';
import MonthNames from '../constants/Months';

export default class AuctionPanel extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        let finishString = (date) => { return 'Finish work by ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(auction.finish_work_by));
        return (
            <div id='mainInfo'>
                <span>{finishString}</span>
            </div>
        );
    }
};
