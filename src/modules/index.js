import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import sample, {sampleSaga} from './sample';
import loading from './loading';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
    counter,
    sample,
    loading
});

// index.js는 modules 폴더에 있는 리듀서를 한 군데에 모아놓은 것이다.

export function* rootSaga() {
    // all 함수는 여러 사가를 합쳐주는 역할을 한다.
    yield all([counterSaga(), sampleSaga()]);
}

export default rootReducer;