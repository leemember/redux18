# 18장. 리덕스 미들웨어를 통한 비동기 작업 관리

#### 2020-12-28 ~ 2021-01-08 (1주차 노트정리 후, 2주차 코딩)

### 프로젝트 필요한 라이브러리

- redux
- react-redux
- redux-actions
- redux-logger
- redux-thunk
- axios
- redux-saga
- redux-devtools-extension

### 작업 디렉토리

- modules/counter.js
- modules/index.js
- modules/sample.js
- modules/loading.js

프레젠테이셔널 컴포넌트 = [components]

- components/Counter.js
- components/Sample.js

컨테이너 컴포넌트 = [containers]

- containers/CounterContainer.js
- containers/SampleContainer.js

라이브러리 [lib]

- lib/loggerMiddleware.js
- lib/api.js
- lib/createRequestThunk.js

---

## 미들웨어란 ?

리덕스 미들웨어는 액션을 디스패치했을 때 리듀서에게 이를 처리하기에 앞서 사전에 지정된 작업들을 실행한다.
쉽게말해, '미들웨어는 액션과 리듀서 사이의 중간자'라고 볼 수있다.

```
액션 -> 미들웨어 -> 리듀서 -> 스토어
```

이런식의 프로세스다. 리듀서가 액션을 처리하기 전에 미들웨어가 할 수 있는 작업은 여러가지가 있다.

1. 전달받은 액션을 단순히 콘솔에 기록한다.
2. 전달받은 액션 정보를 기반으로 액션을 아예 취소한다.
3. 다른 종류의 액션을 추가로 디스패치한다.

미들웨어가 어떻게 작동하는지 이해하려면 직접 만들어보는 것이 효과적이다. <br>
[ilb]-[loggerMiddleware.js] 참조

미들웨어는 결국 함수를 반환하는 함수를 반환하는 함수이다. 그러니 미들웨어 함수를 보면 파라미터로 받아오는 store는 리덕스 스토어 인스턴스를, action은 디스패치된 액션을 가르킨다. 이 두가지는 익숙하나 next는 익숙하지 않다. next 파라미터는 함수형태이며, store.dispatch와 비슷한 역할을 한다.

<br>

큰 차이점은 next(action)을 호출하면 그다음 처리해야 할 미들웨어에게 액션을 넘겨주고, 만약 그다음 미들웨어가 없다면 리듀서에게 액션을 넘겨준다는 것이다.

```
(1) 액션 -> 미들웨어 -> 리듀서 -> 스토어
(2) 액션 -> 리듀서 -> 스토어
// 미들웨어가 없을경우 바로 리듀서한테 액션 넘겨줌
```

미들웨어 내부에서 next역할을 해주는 stroe.dispatch를 사용하면 첫 번째 미들웨어부터 다시 처리합니다.
만약 미들웨어에서 next를 사용하지 않으면 액션이 리듀서에게 전달되지 않습니다. 즉, 액션이 무시되는 것이다.

```
console.group(action && action.type); // 액션 + 액션 타입으로 log를 그룹화함
    console.log('이전상태', store.getState());
    console.log('액션', action);
    next(action); // 다음 미들웨어 혹은 리듀서에게 전달한다.
    console.log('다음상태', store.getState());
    console.groupEnd(); //그룹 끝 ! ! ! ! ! 😁
```

미들웨어에서는 여러 종류의 작업을 처리할 수 있다.

1. 특정 조건에 따라 액션을 무시
2. 특정 조건에 따라 액션 정보를 가로채서 변경한 후 리듀서에게 전달
3. 특정 액션에 기반하여 새로운 액션을 여러 번 디스패치

이러한 미들웨어 속성을 사용하여 네트워크 요청과 같은 <비동기 작업>을 관리하면 매우 유용하다.
redux-logger 미들웨어 설치하고 사용하기. 커스텀으로 제작한 loggerMiddleware보다 훨씬 더 잘 만들어진 라이브러리이다.

redux-logger를 사용하니 콘솔에 색상도 입혀지고, 액션 디스패치 시간도 나타남. 이전 액션이랑 다음 액션 현재 액션까지 전부 자세하게 나온다.

## 비동기작업을 처리하는 미들웨어

1. redux-thunk : 비동기 작업을 처리할 때 가장 많이 사용하는 미들웨어다. '객체가 아닌 함수 형태의 액션'을 디스패치할 수 있게 해준다.
2. redux-saga : thunk 다음으로 가장 많이 사용되는 비동기 작업 관련 미들웨어 라이브러리다. 특정 액션이 디스패치 되었을 때 정해진 로직에 따라 다른 액션을 디스패치 시키는 규칙을 작성하여 비동기 작업을 처리할 수 있게 해준다.

## redux-thunk

- 비동기 작업을 처리할 때 가장 기본적으로 사용하는 미들웨어.
  Thunk란 ? Thunk는 특정 작업을 나중에 할 수 있도록 미루기 위해 함수 형태로 감싼 것이다.
  예를 들어 주어진 파라미터에 1을 더하는 함수를 만들고 싶다면

```
const addOne = x => x + 1;
addOne(1); // 2
```

이 코드를 실행하면 addOne을 호출했을 때 바로 1+1이 연산된다. 그런데 이 연산 작업을 나중에 하도록 미루고 싶다면

```
const addOne = x => x+1;
const addOneThunk = x => () => addOne(x);

const fn = addOneThunk(1);
setTimeout(()=> {
    const value = fn();
    console.log(value);
}, 1000);
```

이렇게 하면 특정 작업을 나중에 하도록 미룰 수 있다. (화살표함수로만 구현)
redux-thunk 라이브러리를 사용하면 thunk 함수를 만들어서 디스패치할 수 있다. 그러면 리덕스 미들웨어가 그 함수를 전달받아 store의 dispatch와 getState를 파라미터로 넣어서 호출해준다.

```
const sampleThunk = () => (dispatch, getState) => {
    //현재 상태를 참조할 수 있고, 새 액션을 디스패치 할 수도 있다.
}
```

한마디로 redux-thunk는 함수 형태의 액션을 디스패치하여 미들웨어에서 해당 함수에 스토어의 dispatch와 getState를 파라미터로 넣어서 사용하는 원리이다. 그래서 구현한 thunk 함수 내부에서 원하는 API 요청도 하고, 다른 액션을 디스패치하거나 현재 상태를 조회하기도 한다.


---

sample 이라는 리듀서에 반복되는 구간들을 리팩토링 한다.

```
[GET_USERS]: state => ({
            ...state,
            loading: {
                ...state.loading,
                GET_USERS: true,
            }
        }),

        //요청 성공시
        [GET_USERS_SUCCESS]: (state, action) => ({
            ...state,
            loading: {
                ...state.loading,
                GET_USERS: false, // 요청완료
            },
            post: action.payload
            //post 읽게 해준다.
        }),

        //요청 실패시
        [GET_USERS_FAILURE]: (state, action) => ({
            ...state,
            loading: {
                ...state.loading,
                GET_USERS: false, // 요청완료
            }
        })
    },
```

이런게 반복됨

---

- post의 경우 title과 vodt
- user의 경우 username과 email 만 보여주는 컴포넌트

이 컴포넌트 만들 때 유효성 검사는 매우 중요하다. 예를들어 post && 를 사용하면 post 객체가 유효할 때만 그 내부의 post.title, post.body 값을 보여주는데 만약 데이터가 없는 상태라면 post.title을 조회하려 할 때 자바스크립트 오류가 발생하니까 꼭 해줘야한다. <br>

 <br>
 user도 마찬가지로 데이터가 배열 형태로 찍어내려고 map 함수를 사용하고 있다.
 하지만 유효성 검사를 하지 않으면 null값에 map 함수를 호출하고 결국 map 함수가 존재하지 않아 오류가 발생하게 된다.

<br>
<br>

## 리팩토링

API를 요청할 때 마다 17줄 정도 되는 thunk 함수를 작성하는 것과 로딩 상태를 리듀서에게 관리하는 작업은 귀찮을 뿐 아니라 코드도 길어지게 만든다.
그러므로 😁반복되는 로직을 따로 분리하여 코드양을 줄여보는 과정이 <b>리팩토링</b>😁이다.

[modules]-[sample.js] 코드를 참고해보면, <br>
1. 코드가 훨신 깔끔해졌다. (= 이게 바로 리팩토링이다.)
2. 해당 리듀서에는 로딩 중에 대한 상태를 관리할 필요가 없고, 성공했을 때의 케이스만 잘 관리해주면 된다.
3. 추가로 실패했을 때의 케이스를 관리하고 싶다면 _FAULURE가 붙은 액션을 리듀서에서 처리해 주면 된다.
4. 다른 방법으로는 컨테이너 컴포넌트에서 try/catch문을 사용하여 에러 값을 조회 할 수 있다.

<br>

redux-thunk를 처음 쓸 때는 작성해야 할 코드가 많아 불편할 수 있지만, 유용한 함수와 리듀서를 만들어서 상태를 관리한다면 매우 깔끔한 코드로 기능을 구현할 수 있다.

<br>

## redux-saga

이 미들웨어는 redux-thunk 다음으로 많이 사용하는 비동기 작업 관련 미들웨어다.
대부분의 경우에는 redux-thunk로도 충분히 기능을 구현할 수 있지만 saga는 좀 더 까다로운 상황에서 유용하다.

<br>

1. 기존 요청을 취소 처리해야 할 때 (불필요한 중복 요청 방지)
2. 특정 액션이 발생했을 때 다른 액션을 발생시키거나, API 요청 등 리덕스와 관계없는 코드를 실행할 때
3. 웹소켓을 이용할 때
4. API 요청 실패 시 재요청해야 할 때

## 제너레이터 함수 이해하기

redux-saga에서는 ES6의 제너레이터 함수라는 문법을 사용한다. 이 문법의 핵심 기능은 함수를 작성할 때 함수를 특정 구간에 멈춰 놓을 수도 있고, 원할 때 다시 돌아가게 할 수도 있다는 것이다.

```

function weirdFunction() {
    return 1;
    return 2;
    return 3;
    return 4;
    return 5;
}
```

하나의 함수에서 값을 여러 개 반환하는 것은 불가능하므로 이 코드는 제대로 작동하지 않는다.
정확히는 호출 할 때마다 맨위에 있는 값인 1만 반환된다.
하지만 제너레이터 함수를 사용하면 함수에서 값을 순차적으로 반환할 수 있게 해준다. 
심지어 함수의 흐름을 도중에 멈춰 놓았다가 다시 이어서 진행 시킬 수도 있다.

```
function* generatorFunction() {
    console.log('ㅎㅇ');
    yield 1;
    console.log('ㅎㅇ');
    yield 2;
    console.log('ㅎㅇ');
    yield 3;
    return 4;
}
```

제너레이터 함수를 만들 때는 function* 키워드를 사용한다.
함수를 작성한 뒤에는 밑에 코드를 사용해 제너레이터를 생성해준다

```
const generator = generatorFunction();
```
제너레이터 함수를 호출했을 때 반환되는 객체를 제너레이터라고 부른다.
제너레이터를 통해 이터레이터를 쉽게 만들 수 있다고 한다. 이터레이터는 Symbol 이터레이터를 가지고 있다. 실행결과는 자기 자신이다.

```
generator.next();
//ㅎㅇ
//{value: 1, done: false}
generator.next();
//ㅎㅇ
//{value: 2, done: false}
generator.next();
//ㅎㅇ
//{value: 3, done: false}
generator.next();
//{value: 4, done: true}
generator.next();
//{value: 4, done: true}
```

이렇게 제너레이터가 처음 만들어지면서 함수의 흐름은 멈춰 있는 상태가 된다. next()가 호출되면 다음 yield가 있는 곳까지 호출하고 다시 함수가 멈춘다. 제너레이터 함수를 사용하면 함수를 도중에 멈출 수도 있고, 순차적으로 여러 값을 반환 시킬 수도 있다. next 함수에 파라미터를 넣으면 제너레이터 함수에서 yield를 사용하여 해당 값을 조회할 수도 있다.

```
function* sumGenerator() {
    console.log('sumGenerator가 만들어졌습니다');
    let a = yield;
    let b = yield;
    yield a + b;
}

const sum = sumGenerator();
sum.next();

//sumGenerator가 만들어졌습니다
// { value: undefined, done: false}
sum.next(1);
// { value: undefined, done: false}
sum.next(2);
// { value: 3, done: false}
sum.next();
// { value: undefined, done: false}
```

위에보면 next 파라미터 값에 1이랑 2를 넣으니 value:3 이라는 답이 나왔다.
그리고 또 sum.next를 선언하니 done:true라는 값이 뜬다.
이렇게 redux-saga는 제너레이터 함수 문법을 기반으로 비동기 작업을 관리해준다.
redux-saga는 우리가 디스패치하는 액션을 모니터링해서 그에 따라 필요한 작업을 따로 수행할 수 있는 미들웨어라는 뜻이다 !

```
[예제]

function* watchGenerator() {
    console.log('모니터링중');
    let prevAction = null;
    while(true) {
        const action = yield;
        console.log('이전액션 : ', prevAction);
        prevAction = action;
        if ( action.type === 'HELLO' ) {
            console.log('안녕하세요');
        }
    }
}

//제너레이터를 생성
const watch = watchGenerator();

watch.next();
//모니터링중
//{value: undefined, done: false}
watch.next({type: 'TEST'});
//이전 액션 : null
//{value: undefined, done: false}
watch.next({type: 'HELLO'});
//이전 액션 : {type: 'TEST'}
//안녕하세요!
//{value: undefined, done: false}

```

위 코드와 비슷한 원리로 작동된다. 제너레이터 함수의 작동 방식만 기본적으로 파악하고 있다면 redux-saga에서 제공하는 여러 유용한 유틸함수를 사용하여 액션을 쉽게 처리할 수 있다.

### 라이브러리 설치하기
```
$npm install redux-saga
```

reudx-saga 라이브러리에서 쓸 수 있는 takeEvery는 들어오는 모든 액션에 대해 특정 작업을 처리해준다. <br>
takeLatest는 기존에 진행 중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.