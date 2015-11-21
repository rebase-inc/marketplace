import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ProfilePicture from './ProfilePicture.react';

export default class ProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        updateProfile: PropTypes.func.isRequired,
        uploadPhoto: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.updateProfileSettings = this.updateProfileSettings.bind(this);
    }

    updateProfileSettings() {
        const settings = {
            name: ReactDOM.findDOMNode(this.refs.name).value,
            email: ReactDOM.findDOMNode(this.refs.email).value,
        }
        this.props.updateProfile(settings);
    }
    render() {
        const { user, roles, uploadPhoto } = this.props;
        return (
            <div className='contentView' id='profileView'>
                <div className='profileSettings'>
                    <ProfilePicture user={user} uploadPhoto={uploadPhoto} dynamic={true}/>
                    <input ref='name' defaultValue={user.name}/>
                    <input ref='email' defaultValue={user.email}/>
                    <button onClick={this.updateProfileSettings}>Update Profile Settings</button>
                </div>
            </div>
        );
    }
};
