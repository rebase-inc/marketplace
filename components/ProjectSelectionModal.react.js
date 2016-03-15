import React, { Component, PropTypes } from 'react';

import ModalContainer from './ModalContainer.react';
import { ProjectListView, Project } from './Project.react';


export default class ProjectSelectionModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        roles: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { importingProject: false };
        this.toggleImport = () => this.setState(s => ({ importingProject: !s.importingProject }));
    }

    render() {
        const { roles, select, close } = this.props;
        return (
            <ModalContainer close={close}>
                <ProjectListView
                    toggleImport={this.toggleImport}
                    roles={Array.from(roles.items.values()).filter(r => r.type == 'manager')}
                    select={select}
                />
            </ModalContainer>
        );
    }
};
