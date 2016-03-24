import React, { Component, PropTypes } from 'react';

import ModalContainer from './ModalContainer.react';
import OrganizationLogo from './OrganizationLogo.react';
import { ProjectListView, Project } from './Project.react';


export default class ProjectSelectionModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        roles: PropTypes.object.isRequired,
    }

    render() {
        const { project, projects, select, close } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>{'Select a Project'}</h3>
                <div className='projectSelectionList'>
                    { projects.map(p => <ProjectSelection project={p} selected={p.id == project.id} />) }
                </div>
                <h5>{'Or, create a new project'}</h5>
            </ModalContainer>
        );
    }
};

const ProjectSelection = (props) => (
    <div className='projectSelection' selected={props.selected}>
        <OrganizationLogo organization={props.project.organization} />
        <span className='project'>{props.project.name}</span>
        <span className='organization'>{props.project.organization.name}</span>
    </div>
);
