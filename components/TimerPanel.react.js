import React, { Component, PropTypes } from 'react';

import { Timer } from './Icons.react';

export default class TimerPanel extends Component {
    static propTypes = {
        expires: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        const { text, expires } = this.props;
        return (
            <td className='timeRemainingPanel'>
                <span>{text}</span>
                <Timer expires={expires}/>
            </td>
        );
    }
}
