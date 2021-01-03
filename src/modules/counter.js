import { createAction, handleAction, handleActions } from 'redux-actions';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

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