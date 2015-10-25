import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class ProjectInfoPanel extends Component {
    render() {
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
                <span>{this.props.ticket.project.name}</span>
                <span>{this.props.ticket.project.organization.name}</span>
                <RatingStars rating={this.props.ticket.project.rating || 3} />
            </td>
        );
    }
};
