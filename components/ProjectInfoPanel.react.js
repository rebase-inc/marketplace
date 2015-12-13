import React, { Component, PropTypes } from 'react';

import RatingStars from './RatingStars.react';

export default class ProjectInfoPanel extends Component {
    render() {
        const { project } = this.props;
        const rating = project.rating ? project.rating/2 : null;
        return (
            <td className='projectInfoPanel'>
                <span>{project.name}</span>
                <span>{project.organization.name}</span>
                <RatingStars rating={rating} />
            </td>
        );
    }
};
