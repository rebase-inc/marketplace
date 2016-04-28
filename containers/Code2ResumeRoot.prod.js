import 'babel-core/polyfill';

import React, { Component } from 'react';
import Code2ResumeApp from './Code2ResumeApp';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import Immutable from 'immutable';

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Code2ResumeApp />
            </Provider>
        );
    }
}
