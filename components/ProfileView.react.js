import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ProfilePicture from './ProfilePicture.react';
import InputField from './InputField.react';
import GithubAccountTag from './GithubAccountTag.react';
import SSHKeyTag from './SSHKeyTag.react';

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
        this.restartTypingTimer = this.restartTypingTimer.bind(this);
        this.state = { name: props.user.name, email: props.user.email };
    }

    restartTypingTimer() {
        clearTimeout(this._timer);
        if (this.state.name != this.props.user.name || this.state.email != this.props.user.email) {
            this._timer = setTimeout(() => this.props.updateProfile(this.state), 800);
        }
    }

    updateProfileSettings() {
        this.props.updateProfile(this.state);
    }

    render() {
        const { user, roles, uploadPhoto, openAddSSHKeyModal } = this.props;
        console.log('keys are ', user.ssh_public_keys.map(k => k));
        return (
            <div className='contentView' id='profileView'>
                <div className='profileSettings' onKeyUp={this.restartTypingTimer}>
                    <ProfilePicture user={user} uploadPhoto={uploadPhoto} dynamic={true}/>
                    <InputField value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} loading={user.name != this.state.name}/>
                    <InputField value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} loading={user.email != this.state.email}/>
                    <div id='githubAccounts'>
                        { user.github_accounts.map(ga => <GithubAccountTag account={ga} />) }
                        <span onClick={() => window.location.replace('/api/v1/github')}>{ 'Add Github Account' }</span>
                    </div>
                    <div id='sshKeys'>
                        { user.ssh_public_keys.map(key => <SSHKeyTag ssh_key={key} />) }
                        <span onClick={openAddSSHKeyModal}>{ 'Add SSH Key' }</span>
                    </div>
                </div>
            </div>
        );
    }
};
