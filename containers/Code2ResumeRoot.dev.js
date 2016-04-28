import 'babel-core/polyfill';

import React, { Component } from 'react';
import Code2ResumeApp from './Code2ResumeApp';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import Immutable from 'immutable';

// Don't do this! You’re bringing DevTools into the production bundle.
import DevTools from './DevTools';

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <Code2ResumeApp />
                    <DevTools />
                </div>
            </Provider>
        );
    }
}
