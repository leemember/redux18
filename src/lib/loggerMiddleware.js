const loggerMiddleware = store => next => action => {
    //미들웨어 기본 구조
    //중간에 next 없으면 액션이 무시되는 것이다.

    console.group(action && action.type); // 액션 + 액션 타입으로 log를 그룹화함
    console.log('이전상태', store.getState());
    console.log('액션', action);
    next(action); // 다음 미들웨어 혹은 리듀서에게 전달한다.
    console.log('다음상태', store.getState());
    console.groupEnd(); //그룹 끝 ! ! ! ! ! 😁

};

export default loggerMiddleware;

/*
위 코드에 리덕스 미들웨어의 구조를 볼 수 있는데,
화살표 함수를 연달아서 사용했는데 일반 function 키워드로 풀어서 쓴다면
이런 구조이다.

const loggerMiddleware = function loggerMiddleware(stroe) {
    retrun function(next) {
        retrun function(action){
            //function 사용한 미들웨어 기본구조
        }
    }
}

너무 복잡하니 화살표로 작성하는게 답임 🙄

*/