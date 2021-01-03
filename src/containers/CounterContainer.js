import React from 'react';
import { connect } from 'react-redux';
import { increase, decrease } from '../modules/counter';
import Counter from '../components/Counter';

const CounterContainer = ({ number, increase, decrease }) => {
    return (
        <Counter number={number} onIncrease={increase} onDecrease={decrease} />        
    );
};

// 리듀서와 연결해주는 것 👇
export default connect(
    state => ({
        number: state.counter
    }),
    {
        increase,
        decrease
    }
)(CounterContainer);

/* 

💙connect()공식

connect(mapStateToProps)(mapDispatchToProps)(연동할 컴포넌트)
고로, 첫번째 파라미터는 현재상태의 props고 두번째 파라미터는 디스패치할 props다.
Dispatch = 액션을 발생시키다.

*/
