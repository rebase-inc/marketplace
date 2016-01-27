import React, { Component } from 'react';
import RebaseIcon from './RebaseIcon.react';

import CheckboxList from './CheckboxList.react';

export default class ProjectSelectionView extends Component {
    constructor(props) {
        super(props);
        this.state = { importingProject: false };
        this.toggleImport = () => this.setState(s => ({ importingProject: !s.importingProject }));
    }
    render() {
        const { roles, select } = this.props;
        const { importingProject } = this.state;
        return (
            <div id='projectSelectionView'>
                <div className='logo'>
                    <RebaseIcon />
                    {'REBASE'}
                </div>
                { importingProject ? <NewProjectView /> :
                    <ProjectListView toggleImport={this.toggleImport} roles={roles.filter(r => r.type == 'manager')} select={select} /> }
            </div>
        );
    }
}

export const NewProjectView = (props) => (
    <div className='content'>
        <div className='title'>{'Select a Project'}</div>
        <CheckboxList items={[{a: 'a', b: 'b'}, {a: 'c', b: 'd'}]} fieldsToDisplay={['a','b']} onSubmit={alert} buttonText={'fuckoff'} />
    </div>
)

export const ProjectListView = (props) => (
    <div className='content'>
        <div className='title'>{'Select a Project'}</div>
        <div className='projects'>
            { props.roles.map(role => <Project project={role.project} select={props.select.bind(null, role.id)} />) }
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
