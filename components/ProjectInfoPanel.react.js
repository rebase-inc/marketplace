import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class ProjectInfoPanel extends Component {
    render() {
        const { project } = this.props;
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
                <span>{project.name}</span>
                <span>{project.organization.name}</span>
                <RatingStars rating={project.rating} />
            </td>
        );
    }
};
