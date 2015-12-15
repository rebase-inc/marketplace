import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import * as reducers from '../reducers';
import thunkMiddleware from 'redux-thunk';

const finalCreateStore = compose(
    // Middleware you want to use in production:
    applyMiddleware(thunkMiddleware),
    // Other store enhancers if you use any
)(createStore);

export default function configureStore(initialState) {
    const reducer = combineReducers(reducers);
    return finalCreateStore(reducer, initialState);
};
