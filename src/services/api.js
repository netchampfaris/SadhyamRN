import { AsyncStorage } from 'react-native';

const SERVER_URL = 'https://secure-mesa-75051.herokuapp.com';
const links = {
    LOGIN_URL: SERVER_URL + '/api/subscriber/v1/user/login/',
    LOGOUT_URL: SERVER_URL + '/api/subscriber/v1/user/logout/',
    QUESTIONS_URL: SERVER_URL + '/api/quiz/v1/question/',
    SUBMIT_ANSWERS_URL: SERVER_URL + '/api/qresponse/v1/practice_result/'
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

const getSubmitAnswersUrl = () => {
    return getUser()
        .then(({user, api_key}) =>
            `${links.SUBMIT_ANSWERS_URL}?username=${user}&api_key=${api_key}`
        );
}

const submitAnswers = ({ marksObtained, totalQuestions }) => {
    return Promise.all([
        getUser(),
        getSubmitAnswersUrl()
    ]).then(([{ user }, url ]) => {
        console.log(user, url)
        const body = {
            subscriber: user,
            marks_obtained: marksObtained,
            total_marks: totalQuestions
        };
        console.log(body)
        return fetch(url, {
            method: 'POST',
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
        })
    });
}

export {
    getQuestions,
    getLoginUrl,
    getLogoutUrl,
    submitAnswers
};