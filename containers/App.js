import 'babel-core/polyfill';

import React, { Component } from 'react';
import RebaseApp from './RebaseApp';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from '../reducers';
import Immutable from 'immutable';

const reducer = combineReducers(reducers);

let store;
switch (process.env.NODE_ENV) {
    case 'production': {
        store = applyMiddleware(thunkMiddleware)(createStore)(reducer);
        break;
    }
    default: {
        const loggerMiddleware = createLogger({
            transformer: (state) => {
                var newState = {};
                for (var i of Object.keys(state)) {
                    if (Immutable.Iterable.isIterable(state[i])) {
                        newState[i] = state[i].toJS();
                    } else {
                        newState[i] = state[i];
                    }
                };
                return newState;
            }
        });
        const debugSession = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
        store = compose(
            applyMiddleware(thunkMiddleware, loggerMiddleware),
            require('redux-devtools').devTools(),
            require('redux-devtools').persistState(debugSession)
        )(createStore)(reducer);
        if (module.hot) {
            // the hot swap of the reducers needs to be done explicitly
            module.hot.accept('../reducers', () => store.replaceReducer(combineReducers(require('../reducers'))));
        }
    }
}

export default class App extends Component {

    render() {
        return (
            <div>
            <Provider store={store}>
            <RebaseApp />
            </Provider>
            <DebugPanel top right bottom>
                <DevTools select={state => state} store={store} monitor={LogMonitor} visibleOnLoad={false} />
            </DebugPanel>
            </div>
        );
    }
}
