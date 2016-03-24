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
        const { project, roles, select, close } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>{'Select a Project'}</h3>
                <div className='projectSelectionList'>
                    { roles.map(r => <ProjectSelection project={r.project} select={select.bind(null, r.id)} selected={r.project.id == project.id} close={close} />) }
                </div>
                <h5>{'Or, create a new project'}</h5>
            </ModalContainer>
        );
    }
};

const ProjectSelection = (props) => (
    <div className='projectSelection' selected={props.selected} onClick={props.selected ? props.close : props.select}>
        <OrganizationLogo organization={props.project.organization} />
        <span className='project'>{props.project.name}</span>
        <span className='organization'>{props.project.organization.name}</span>
    </div>
);
