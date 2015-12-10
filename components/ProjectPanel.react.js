import React, { Component, PropTypes } from 'react';

export default class ProjectPanel extends Component {
    render() {
        return (
            <td className='projectPanel'>
                <span>{this.props.project}</span>
            </td>
        );
    }
}
