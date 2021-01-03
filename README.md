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

------------------------------

## redux-thunk