export default function createReducer(initialState, hanlders) {
   
    return function reducer(state = initialState, action) {
        if(Object.prototype.hasOwnProperty.call(hanlders, action.type)) {
            return hanlders[action.type](state, action)
        }
        return state;
    }
}