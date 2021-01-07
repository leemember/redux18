import React from 'react';
import CounterContainer from './containers/CounterContainer';
import SampleContainer from './containers/SampleContainer';

const App = () => {
  return (
    <div>
      <h1>redux-thunk</h1>
      <SampleContainer />

      <h1>redux-saga</h1>
      <CounterContainer />
    </div>
  );
}

export default App;