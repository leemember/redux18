import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
// call, put
import * as api from '../lib/api';
import createRequstSaga from '../lib/createRequestSaga';

// 액션 타입을 선언합니다.
// 한 요청당 세 개를 만들어야 합니다.

//GET_POST 포스트 읽기용
const GET_POST = 'sample/GET_POST';
const GET_POST_SUCCESS = 'sample/GET_POST_SUCCESS';
// const GET_POST_FAILURE = 'sample/GET_POST_FAILURE';

//GET_USERS 사용자 정보 불러오기용
const GET_USERS = 'sample/GET_USERS';
const GET_USERS_SUCCESS = 'sample/GET_USERS_SUCCESS';
// const GET_USERS_FAILURE = 'sample/GET_USERS_FAILURE';

export const getPost = createAction(GET_POST, id => id);
export const getUsers = createAction(GET_USERS);

const getPostSaga = createRequstSaga(GET_POST, api.getPost);
const getUsersSaga = createRequstSaga(GET_USERS, api.getUsers);

// function* getPostSaga(action) {
//     yield put(startLoading(GET_POST)); //로딩시작
//     // 파라미터로 action을 받아 오면 액션의 정보를 조회할 수 있다.

//     try {
//         //call을 사용하면 Promise를 반환하는 함수를 호출하고, 기다릴 수 있다.
//         //첫 번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수다.

//         const post = yield call(api.getPost, action.payload);
//         //api.getPost(action.payload)를 의미한다. 

//         yield put({
//             type: GET_POST_SUCCESS,
//             payload: post.data
//         });
//     } catch (e) {
//         //try/catch 문을 사용하여 에러도 잡을 수 있다.
//         yield put({
//             type: GET_POST_FAILURE,
//             payload: e,
//             error: true
//         });
//     }

//     yield put(finishLoading(GET_POST)); // 로딩 완료
// }

// function* getUsersSaga() {
//     yield put(startLoading(GET_USERS));
//     try {
//         const users = yield call(api.getUsers);
//         yield put({
//             type: GET_USERS_SUCCESS,
//             payload: users.data
//         });
//     } catch (e) {
//         yield put({
//             type: GET_USERS_FAILURE,
//             payload: e,
//             error: true
//         });
//     }
//     yield put(finishLoading(GET_USERS));
// }

export function* sampleSaga() {
    yield takeLatest(GET_POST, getPostSaga);
    yield takeLatest(GET_USERS, getUsersSaga);
}

// 초기 상태 선언한다.
// 요청의 로딩 중 상태는 loading이라는 객체에서 관리한다.

const initialState = {
    post: null,
    users: null
};

const sample = handleActions(
    {
        [GET_POST_SUCCESS]: (state, action) => ({
            ...state,            
            post: action.payload
        }),
        [GET_USERS_SUCCESS]: (state, action) => ({
            ...state,
            users: action.payload
        })
    },
    initialState
);

export default sample;

/* 

GET_POST 액션의 경우에는 API를 요청 할 때 어떤 ID로 조회할지 정해줘야한다.
redux-saga를 사용할 때는 id처럼 요청에 필요한 값을 액션의 payload로 넣어줘야한다.

 */