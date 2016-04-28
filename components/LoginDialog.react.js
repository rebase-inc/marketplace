import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingAnimation from './LoadingAnimation.react';
import SpinningGears from './SpinningGears.react';

import { Logo } from './Icons.react';
import RebaseLogo from './RebaseLogo.react';

import * as UserActions from '../actions/UserActions';


export default class LoginDialog extends Component {
    static propTypes = {
        onLogin: React.PropTypes.func.isRequired,
        isLoading: React.PropTypes.bool.isRequired,
    }

    render = () => {
        const { isLoading } = this.props;
        return (
            <div id='login-background'>
                { isLoading ? <SpinningGears /> : <LoginBox {...this.props} /> }
            </div>
        );
    }
};

export class LoginBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.login = this.login.bind(this);
    }
    login() {
        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        this.props.onLogin(email, password);
    }
    render() {
        const { error } = this.props;
        return (
            <div id='login-box' onKeyPress={(e) => { (e.charCode == 13) ? this.login() : null }}>
                <RebaseLogo />
                <input data-warning={!!error || undefined} id='email' type='email' ref='email' className='required email' placeholder='Email' />
                <input data-warning={!!error || undefined} id='password' type='password' ref='password' placeholder='Password' />
                <button id='log-in' onClick={this.login}>{'Log in'}</button>
                <span data-warning>{error}</span>
            </div>
        );
    }
}
