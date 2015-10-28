import 'babel-core/polyfill';

import React, { Component } from 'react';
import RebaseApp from './RebaseApp';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from '../reducers';

// there is a method in the redux library for doing this without specifying each by hand...TODO: Use it
const reducer = combineReducers(reducers);

let store;
switch (process.env.NODE_ENV) {
    case 'production': {
        store = applyMiddleware(thunkMiddleware)(createStore)(reducer);
        break;
    }
    default: {
        const loggerMiddleware = createLogger();
        const debugSession = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
        store = compose(
            applyMiddleware(thunkMiddleware),
            require('redux-devtools').devTools(),
            require('redux-devtools').persistState(debugSession)
        )(createStore)(reducer);
    }
}

if (module.hot) {
    // the hot swap of the reducers needs to be done explicitly
    module.hot.accept('../reducers', () => store.replaceReducer(combineReducers(require('../reducers'))));
}

export default class App extends Component {

  render() {
    const debug = false;
    return (
      <div>
        <Provider store={store}>
          <RebaseApp />
        </Provider>
        { debug ?
            <DebugPanel top right bottom>
                <DevTools store={store} monitor={LogMonitor} visibleOnLoad={true} />
            </DebugPanel> : null
        }
      </div>
    );
  }
}
