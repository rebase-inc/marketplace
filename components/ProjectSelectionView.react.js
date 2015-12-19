import React, { Component } from 'react';
import RebaseIcon from './RebaseIcon.react';

export default class ProjectSelectionView extends Component {
    render() {
        const { roles, select } = this.props;
        const projectRoles = roles.filter(role => role.type == 'manager');
        return (
            <div id='projectSelectionView'>
                <div className='logo'>
                    <RebaseIcon />
                    {'REBASE'}
                </div>
                <div className='content'>
                    <div className='title'>{'Select a Project'}</div>
                    <div className='projects'>
                        { projectRoles.map(role => <Project project={role.project} select={select.bind(null, role.id)} />) }
                    </div>
                    <div className='or'>OR</div>
                    <button>Create a New Project</button>
                </div>
            </div>
        );
    }
}

export const Project = (props) => (
    <div className='project' onClick={props.select}>
        <div>{props.project.organization.name}</div>
        <div>{props.project.name}</div>
    </div>
)
