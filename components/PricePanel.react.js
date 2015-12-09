import React, { Component, PropTypes } from 'react';

export default class PricePanel extends Component {
    render() {
        return (
            <td className='pricePanel'>
                <span>{'$'+this.props.price}</span>
            </td>
        );
    }
}
