import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import keymirror from 'keymirror';

import ImportProjectModal from './ImportProjectModal.react';

import { AddNewProject, ProjectGraph } from './Icons.react';
const ModalTypes = keymirror({ ADD_PROJECT: null, DELETE_PROJECT: null });

export default class ProjectView extends Component {
    static propTypes = {
        roles: PropTypes.array.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalType: null, selectedProject: null };
    }

    _makeProjectElement(role) {
        if (role.type == 'manager') {
            return (
                <div className='project' key={role.id}>
                    <ProjectGraph />
                    <div className='projectDetails'>
                        <span className='orgName'>{role.project.organization.name}</span>
                        <span className='projName'>{role.project.name}</span>
                        <span className='projDelete' onClick={() => alert('bar')}>Delete Project?</span>
                    </div>
                </div>
            );
        }
    }

    render() {
        const { roles } = this.props;
        return (
            <div className='contentView' id='projectView'>
                {
                    () => {
                        switch (this.state.modalType) {
                            case ModalTypes.ADD_PROJECT:
                                // This modal is scoped to its own state so it doesn't take any functions as
                                // properties. Not sure this is the correct way to do it...feel free to refactor
                                return <ImportProjectModal close={() => this.setState({ modalType: null})} />;
                                break;
                            case ModalTypes.DELETE_PROJECT:
                                return <DeleteProjectModal close={() => this.setState({ modalType: null})} deleteProject={() => alert('heyoo')} />;
                                break;
                            default: return null; break;
                        }
                    }()
                }
                <div className='projectInfo'>
                    <div ref='projectList' className='projectList'>
                        { roles.map(this._makeProjectElement) }
                    </div>
                    <AddNewProject onClick={() => this.setState({ modalType: ModalTypes.ADD_PROJECT})} />
                </div>
            </div>
        );
    }
};

