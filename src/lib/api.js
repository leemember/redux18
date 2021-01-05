import axios from 'axios';

//GET_POST 포스트 읽기용
export const getPost = id =>
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);

//GET_USERS 사용자 정보 불러오기용
export const getUsers = id =>
    axios.get(`https://jsonplaceholder.typicode.com/users`)


/* 

이렇게 AIP를 호출하는 함수를 따로 작성하면, 나중에 사용할 때 가독성도 좋고 유지보수도 쉬워진다.
다른 파일에서 불러와 사용할 수 있도록 export를 사용하여 내보낸다.

*/