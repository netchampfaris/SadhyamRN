import config from './config';

export const getQuestions = () => {
    return fetch(`${config.url}/api/quiz/v1/question/?number_of_question=10&username=${config.username}&api_key=${config.token}`)
        .then((res) => {
            return res.json();
        });
}