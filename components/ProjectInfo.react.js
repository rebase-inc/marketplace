import React, { Component, PropTypes } from 'react';

import OrganizationLogo from './OrganizationLogo.react';
import SwitchProjectIcon from './SwitchProjectIcon.react';

export default class ProjectInfo extends Component {
    static propTypes = {
        switchProject: PropTypes.func.isRequired,
        project: PropTypes.object.isRequired,
    }

    render() {
        const { switchProject, project } = this.props;
        return (
            <div id='projectInfo'>
                <OrganizationLogo organization={project.organization} />
                <div className='name' data-selected={true}>
                    <span className='project'>{ project.name }</span>
                    <span className='organization'>{ project.organization.name } </span>
                </div>
                <SwitchProjectIcon onClick={switchProject} />
            </div>
        );
    }
}
