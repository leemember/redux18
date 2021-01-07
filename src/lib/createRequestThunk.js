import { startLoading, finishLoading } from '../modules/loading';

export default function createRequestThunk(type, request) {
    //성공 및 실패 액션 타입을 정의합니다.

    const SUCCESS = `${type}_SUCCESS`; //성공 액션타입
    const FAILURE = `${type}_FAILURE`; //실패 액션타입
    return params => async dispatch => {
        dispatch({ type }); // 시작
        dispatch(startLoading(type));
        try {
            const response = await request(params);
            dispatch({
                type:SUCCESS,
                payload:response.data
            }); // 성공
            dispatch(finishLoading(type));
        } catch (e) {
            dispatch({
                type:FAILURE,
                payload: e,
                error: true
            });
            dispatch(startLoading(type));
            throw e;
        }
    }
}

//dispatch(startLoading(type)); 는 액션을 디스패치해 줄 때마다 실행한다.
//시작시, 성공시, 실패시 각각 한 번씩 선언함
//시작과 성공시에는 startLoading, 실패시에는 finishLoading 

// 사용법 : createRequestThunk('GET_USERS, api.getUsers);

/*

이번에 만든 유틸함수는 API 요청을 해주는 thunk 함수를 한 줄로 생성할 수 있게 해준다.
액션 타입과 API를 요청하는 함수는 파라미터로 넣어 주면 나머지 작업을 대신 처리해준다. 

*/