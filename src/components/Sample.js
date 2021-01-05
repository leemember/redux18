// post의 경우 title과 body만 보여주고 user의 경우 username과 email 만 보여주는 컴포넌트

import React from 'react';

const Sample = ({ loadingPost, loadingUsers, post, users }) => {
    return (
        <div>
            <section>
                <h1>포스트</h1>
                {loadingPost && '로딩 중...'}
                {/* !로 유효성 검사를 해준다. */}
                {!loadingPost && post && (
                    <div>
                        <h3>{post.title}</h3>
                        <h3>{post.body}</h3>
                    </div>
                )}
            </section>
            <hr />
            {/* ---------------------------------------------------- */}
            <section>
                <h1>사용자 목록</h1>
                {loadingUsers && '로딩 중...'}
                {!loadingUsers && users && (
                   <ul>
                       {users.map(user => (
                           <li key={user.id}>
                               {user.username} ({user.email})
                           </li>
                       ))}
                   </ul>
                )}
            </section>
        </div>
    );
};

export default Sample;


/*

데이터를 불러와 렌더링해 줄 때는 유효성 검사를 해 주는 것이 중요하다.
예를들어 post && 를 사용하면 post 객체가 유효할 때만 그 내부의  post.title, post.body 값을 보여준다.

만약 데이터가 없는 상태라면 post.title을 조회하려고 할 때 js 오류가 발생하니 반드시 유효성 검사를 해줘야 한다.
!loadingUsers << 이것이 유효성 검사임

user도 마찬가지로 데이터가 배열 형태로 돌아올 것을 기대하고 map 함수를 사용하고 있다. 하지만 유효성 검사를 하지 않으면 null 값에 map 함수를 호출하고 결국 map 함수가 존재하지 않아 오류가 발생하게 된다.

*/