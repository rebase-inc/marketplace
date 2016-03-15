import React from 'react';

export const ProjectListView = (props) => (
    <div className='content'>
        <div className='title'>{'Select a Project'}</div>
        <div className='projects'>
            { props.roles.map(role => <Project key={role.id} project={role.project} select={props.select.bind(null, role.id)} />) }
        </div>
        <div className='or'>OR</div>
        <button onClick={props.toggleImport}>Create a New Project</button>
    </div>
)

export const Project = (props) => (
    <div className='project' onClick={props.select}>
        <div>{props.project.organization.name}</div>
        <div>{props.project.name}</div>
    </div>
)
