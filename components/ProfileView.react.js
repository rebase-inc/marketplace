import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { ProfilePicture } from './Icons.react';

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
            first_name: ReactDOM.findDOMNode(this.refs.first_name).value,
            last_name: ReactDOM.findDOMNode(this.refs.last_name).value,
            email: ReactDOM.findDOMNode(this.refs.email).value,
        }
        this.props.updateProfile(settings);
    }
    render() {
        const { user, roles } = this.props;
        return (
            <div className='profileView'>
                <div className='profileSettings'>
                    <ProfilePicture user={user} uploadPhoto={this.uploadPhoto} dynamic={true}/>
                    <input ref='first_name' defaultValue={user.first_name}/>
                    <input ref='last_name' defaultValue={user.last_name}/>
                    <input ref='email' defaultValue={user.email}/>
                    <input ref='location' defaultValue='Seattle, WA'/>
                    <button onClick={this.updateProfileSettings}>Update Profile Settings</button>
                </div>
            </div>
        );
    }
};
