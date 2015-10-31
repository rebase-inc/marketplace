import React, { Component, PropTypes } from 'react';

export default class TitlePanel extends Component {
    render() {
        return (
            <td className='titlePanel'>
                <span>{this.props.title}</span>
            </td>
        );
    }
}
