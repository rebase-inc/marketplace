import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProfileOptions from './ProfileOptions.react';
import ProjectInfo from './ProjectInfo.react';
import ViewSelector from './ViewSelector.react';

export default class MainHeader extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        view: PropTypes.object.isRequired,
        views: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        walkthrough: PropTypes.object.isRequired,
    };

    render() {
        const { user, walkthrough, roles, view, views, actions, walkthroughActions } = this.props;
        const role = roles.items.get(user.current_role.id); 
        const otherProps = { walkthrough, walkthroughActions, role, view };
        return (
            <div id='mainHeader' className='noselect'>
                <ViewSelector views={Array.from(views.items.values())} selectView={actions.selectView} {...otherProps} />
                { role.type == 'manager' ? <ProjectInfo switchProject={actions.openProjectSelectionModal} project={role.project} /> : null }
                <ProfileOptions actions={actions} user={user} {...otherProps} />
            </div>
        );
    }
}
