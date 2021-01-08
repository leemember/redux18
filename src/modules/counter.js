import { createAction, handleActions } from 'redux-actions';
import { delay, put, takeEvery, takeLatest, select } from 'redux-saga/effects'

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

const INCREASE_ASYNC = 'counter/INCREASE_ASYNC';
const DECREASE_ASYNC = 'counter/DECREASE_ASYNC';

//마우스 클릭 이벤트가 payload 안에 들어가지 않도록
// () => undefined를 두번째 파라미터로 넣어준다.
export const increaseAsync = createAction(INCREASE_ASYNC, () => undefined);
export const decreaseAsync = createAction(DECREASE_ASYNC, () => undefined);

function* increaseSaga() {
    yield delay(1000); // 1초
    yield put(increase()); //특정 액션을 디스패치한다.
    const number = yield select(state => state.counter);
    // state는 스토어 상태를 의미한다.
    console.log(`현재 값은 ${number}입니다.`);
}

function* decreaseSaga() {
    yield delay(1000); // 1초
    yield put(decrease()); //특정 액션을 디스패치한다.
}

export function* counterSaga(){
    //takeEvery는 들어오는 모든 액션에 대해 특정 작업을 처리한다.
    yield takeEvery(INCREASE_ASYNC, increaseSaga);

    //takeLatest는 기존에 진행 중이었던 작업이 있다면 취소하고 가장 마지막으로 실행된 작업만 수행한다.
    yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}
const initialState = 0;
// 상태는 꼭 객체일 필요가 없다. 숫자도 작동

const counter = handleActions(
    {
        [INCREASE] : state => state + 1,
        [DECREASE] : state => state - 1,
    },
    initialState
);
//증가일 경우 현재상태에서 +1 , 감소일 경우 현재상태에서 -1

export default counter;