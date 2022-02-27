import { combineReducers } from 'redux';
import sessionReducer from './session'

const Reducers = {
    session: sessionReducer
};

export default combineReducers(Reducers);