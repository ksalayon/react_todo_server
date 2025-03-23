const responseMessages = Object.freeze({
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
    200: 'Successful',
    201: 'Created',
});

/**
 * User related error messages
 */

const userResponseMessages = Object.freeze({
    ...responseMessages,
    400: 'Bad Request',
    404: 'User Not Found',
    409: 'Email already exists',
});

const signupResponseMessages = Object.freeze({
    ...responseMessages,
    404: 'Activation key not found',
});
const responseModel = Object.freeze({
    GENERAL: 'general',
    USER: 'user',
    SIGNUP: 'signup',
});

const responseMappings = {
    [responseModel.GENERAL]: responseMessages,
    [responseModel.USER]: userResponseMessages,
    [responseModel.SIGNUP]: signupResponseMessages,
};

const getResponseMessage = (code, model) => {
    const modelMessages = responseMappings[model] || {};
    return modelMessages[code] || 'Unknown Error';

};

const getResponseStatusWithMessage = (res, code, model) => {
    const responseMessage = getResponseMessage(code, model);
    res.status(code).json({ error: responseMessage });
};

const sendServerError = (res, model) => {
    const errorMessage = getResponseMessage(500, model);
    res.status(500).send(errorMessage);
};

module.exports = { getResponseMessage,  responseModel, getResponseStatusWithMessage, sendServerError};
