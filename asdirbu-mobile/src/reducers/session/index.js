import createReducer from '../createReducer';
import Types from './types';

const initialState = {
    token: null,
    usertype: 'customer',
    data:null,
    search :null,
    city: null,
    member: null
};

export default createReducer(initialState, {
    [Types.SETTOKEN]: (state, {payload}) => ({
        ...state,
        token: payload.token
    }),
    [Types.SETUSERTYPE]: (state, {payload}) => ({
        ...state,
        usertype: payload.usertype
    }),
    [Types.LOGIN]: (state, {payload}) => ({
        ...state,
        data: payload.data
    }),
    ['SEARCH']: (state, {payload}) => ({
        ...state,
        search: payload.data
    }),
    ['CITY']: (state, {payload}) => ({
        ...state,
        city: payload.data
    }),
    ['MEMBER']: (state, {payload}) => ({
        ...state,
        member: payload.data
    })
})