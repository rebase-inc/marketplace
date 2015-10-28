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
        const { isLoading } = this.props;
        return (
            <div id='login-background'>
                <div id='login-box' onKeyPress={(e) => { if (event.charCode == 13) this.login(); }}>
                    <Logo />
                    <p>{ this.props.error }</p>
                    <input id='email' type='email' ref='email' className='required email' placeholder='Email' />
                    <input id='password' type='password' ref='password' placeholder='Password' />
                    <button id='log-in' onClick={this.login}>{ isLoading ? <LoadingAnimation /> : 'Log in' }</button>
                    <div id='error-message'></div>
                </div>
            </div>
        );
    }
};
