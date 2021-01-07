import { handleActions } from 'redux-actions';
import * as api from '../lib/api';
import createRequestThunk from '../lib/createRequestThunk';

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

//thunk 함수를 생성합니다.
//thunk 함수 내부에서는 시작할 때, 성공했을 때, 실패했을 때 다른 액션을 디스패치 합니다.

export const getPost = createRequestThunk(GET_POST, api.getPost);
export const getUsers = createRequestThunk(GET_USERS, api.getUsers);

// 초기상태 선언하기.
// 요청의 로딩 중 상태는 loading 이라는 객체에서 관리합니다.

const initialState = {
    // loading: {
    //     GET_POST:false,
    //     GET_USERS: false
    // },

    post: null,
    users: null
};

const sample = handleActions(
    {
        // 요청시작
        // [GET_POST]: state => ({
        //     ...state,
        //     loading: {
        //         ...state.loading,
        //         GET_POST: true,
        //     }
        // }),

        //요청 성공시
        [GET_POST_SUCCESS]: (state, action) => ({
            ...state,
            // loading: {
            //     ...state.loading,
            //     GET_POST: false, // 요청완료
            // },
            post: action.payload
            //post 읽게 해준다.
        }),

        //요청 실패시
        // [GET_POST_FAILURE]: (state, action) => ({
        //     ...state,
        //     loading: {
        //         ...state.loading,
        //         GET_POST: false, // 요청완료
        //     }
        // }),

        // ---------------------------------------------

        // 요청시작
        // [GET_USERS]: state => ({
        //     ...state,
        //     loading: {
        //         ...state.loading,
        //         GET_USERS: true,
        //     }
        // }),

        //요청 성공시
        [GET_USERS_SUCCESS]: (state, action) => ({
            ...state,
            // loading: {
            //     ...state.loading,
            //     GET_USERS: false, // 요청완료
            // },
            users: action.payload
            //post 읽게 해준다.
        })

        //요청 실패시
        // [GET_USERS_FAILURE]: (state, action) => ({
        //     ...state,
        //     loading: {
        //         ...state.loading,
        //         GET_USERS: false, // 요청완료
        //     }
        // })
    },
    initialState
);

export default sample;



// 코드가 훨신 깔끔해졌다.
// sample 리듀서에는 로딩 중에 대한 상태를 관리할 필요가 없고, 성공했을 때의 케이스만 잘 관리해주면 된다.
// 추가로 실패했을 때의 케이스를 관리하고 싶다면 _FAULURE가 붙은 액션을 리듀서에서 처리해 주면 된다.
// 다른 방법으로는 컨테이너 컴포넌트에서 try/catch문을 사용하여 에러 값을 조회 할 수 있다.