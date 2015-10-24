import 'babel-core/polyfill';

import React, { Component } from 'react';
import RebaseApp from './RebaseApp';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { user as userReducer } from '../reducers';
import { role as roleReducer } from '../reducers';


const reducer = combineReducers({user: userReducer, role: roleReducer});

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
            applyMiddleware(thunkMiddleware, loggerMiddleware),
            require('redux-devtools').devTools(),
            require('redux-devtools').persistState(debugSession)
        )(createStore)(reducer);
    }
}

if (module.hot) {
    // the hot swap of the reducers needs to be done explicitly
    //module.hot.accept('../reducers', () => store.replaceReducer(combineReducers(require('../reducers'))));
}

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <RebaseApp />
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} visibleOnLoad={true} />
        </DebugPanel>
      </div>
    );
  }
}
