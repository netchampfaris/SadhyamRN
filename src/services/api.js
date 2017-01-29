import { AsyncStorage } from 'react-native';

const SERVER_URL = 'https://secure-mesa-75051.herokuapp.com';
const links = {
    LOGIN_URL: SERVER_URL + '/api/subscriber/v1/user/login/',
    LOGOUT_URL: SERVER_URL + '/api/subscriber/v1/user/logout/',
    QUESTIONS_URL: SERVER_URL + '/api/quiz/v1/question/'
}

const getUser = () => {
    return AsyncStorage.multiGet(['user', 'api_key'])
    .then(values =>
        values.reduce((prev, curr) =>
            Object.assign(prev, { [curr[0]]: curr[1] }), {})
    )
}

const getQuestionsUrl = () => {
    return getUser()
        .then(({user, api_key}) =>
            `${links.QUESTIONS_URL}?number_of_question=10&username=${user}&api_key=${api_key}`
        );
}
const getLoginUrl = () => links.LOGIN_URL;

const getLogoutUrl = () => {
    return getUser()
        .then(({user, api_key}) =>
            `${links.LOGOUT_URL}?username=${user}&api_key=${api_key}`
        );
}

const getQuestions = () => {
    return getQuestionsUrl()
        .then(fetch)
        .then(res => res.json());
}


export {
    getQuestions,
    getLoginUrl,
    getLogoutUrl
};