import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingAnimation from './LoadingAnimation.react';

import { Logo } from './Icons.react';

import * as UserActions from '../actions/UserActions';


export default class LoginDialog extends Component {
    static propTypes = {
        onLogin: React.PropTypes.func.isRequired,
        isLoading: React.PropTypes.bool.isRequired,
    }

    login = () => {
        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        this.props.onLogin(email, password);
    }

    render = () => {
        const { isLoading, error } = this.props;
        return (
            <div id='login-background'>
                <div id='login-box' onKeyPress={(e) => { (e.charCode == 13) ? this.login() : null }}>
                    <Logo />
                    <input data-warning={!!error || undefined} id='email' type='email' ref='email' className='required email' placeholder='Email' />
                    <input data-warning={!!error || undefined} id='password' type='password' ref='password' placeholder='Password' />
                    <button id='log-in' onClick={this.login}>{ isLoading ? <LoadingAnimation /> : 'Log in' }</button>
                    <span data-warning>{error}</span>
                </div>
            </div>
        );
    }
};
