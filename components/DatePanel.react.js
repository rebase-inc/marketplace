import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class DatePanel extends Component {
    render() {
        const { text, date } = this.props;
        let dateString = (date) => { return MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(date));
        return (
            <td className='datePanel'>
                <span>{text}</span>
                <span>{dateString}</span>
            </td>
        );
    }
}
