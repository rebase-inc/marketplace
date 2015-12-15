import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import * as reducers from '../reducers';
import thunkMiddleware from 'redux-thunk';
import DevTools from '../containers/DevTools';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';
import Immutable from 'immutable';

const loggerMiddleware = createLogger({
    stateTransformer: (state) => {
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

function getDebugSessionKey() {
    // By default we try to read the key from ?debug_session=<key> in the address bar
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0)? matches[1] : null;
}

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument(),
    persistState(getDebugSessionKey()),
)(createStore);

export default function configureStore(initialState) {
    const reducer = combineReducers(reducers);
    const store = finalCreateStore(reducer, initialState);
    if (module.hot) {
        // the hot swap of the reducers needs to be done explicitly
        module.hot.accept('../reducers', () => store.replaceReducer(combineReducers(require('../reducers'))));
    }
    return store;
};
