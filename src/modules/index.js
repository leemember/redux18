import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
    counter
});

// index.js는 modules 폴더에 있는 리듀서를 한 군데에 모아놓은 것이다.

export default rootReducer;