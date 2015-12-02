import React, { Component, PropTypes } from 'react';

import { humanReadableDate } from '../utils/date';

export default class DatePanel extends Component {
    render() {
        const { text, date } = this.props;
        return (
            <td className='datePanel'>
                <span>{text}</span>
                <span>{ humanReadableDate(date, false) }</span>
            </td>
        );
    }
}
