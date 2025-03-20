import {createStore} from 'redux';
import {AuthReducer} from './AuthReducer'

const store = createStore(AuthReducer)

export default store;