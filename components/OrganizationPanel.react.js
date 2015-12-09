import React, { Component, PropTypes } from 'react';

export default class OrganizationPanel extends Component {
    render() {
        return (
            <td className='organizationPanel'>
                <span>{this.props.organization}</span>
            </td>
        );
    }
}
