import React, { Component, PropTypes } from 'react';

export default class PaidPanel extends Component {
    render() {
        return (
            <td className='paidPanel'>
                <span>{this.props.paid ? 'paid' : 'not paid'}</span>
            </td>
        );
    }
}
