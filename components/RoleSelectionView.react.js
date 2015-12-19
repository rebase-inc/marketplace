import React, { Component } from 'react';

import ProjectSelectionView from './ProjectSelectionView.react';

export default class RoleSelectionView extends Component {
    componentWillMount() {
        const devRole = this.props.roles.find(role => role.type == 'contractor');
        if (devRole) {
            // for now, people can't be managers and devs. So just automatically select the dev role
            this.props.select(devRole.id);
        }
    }
    render() {
        const { roles } = this.props;
        if (roles.find(role => role.type == 'contractor')) {
            return <div>Youre a dev!</div>;
        } else {
            return <ProjectSelectionView {...this.props} />; 
        }
    }
}
