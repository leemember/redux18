import React from 'react';
import { connect } from 'react-redux';
import { increaseAsync, decreaseAsync } from '../modules/counter';
import Counter from '../components/Counter';

const CounterContainer = ({ number, increaseAsync, decreaseAsync }) => {
    return (
        <Counter number={number} onIncrease={increaseAsync} onDecrease={decreaseAsync} />        
    );
};

// 리듀서와 연결해주는 것 👇
export default connect(
    state => ({
        number: state.counter
    }),
    {
        increaseAsync,
        decreaseAsync
    }
)(CounterContainer);

/* 

💙connect()공식

connect(mapStateToProps)(mapDispatchToProps)(연동할 컴포넌트)
고로, 첫번째 파라미터는 현재상태의 props고 두번째 파라미터는 디스패치할 props다.
Dispatch = 액션을 발생시키다.

*/
