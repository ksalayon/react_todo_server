const errorMessages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
};

/**
 * User related error messages
 */

const userErrorMessages = {
    ...errorMessages,
    400: 'Bad Request',
    404: 'User Not Found',
    409: 'Email already exists',
};

const errorModel = Object.freeze({
    GENERAL: 'general',
    USER: 'user',
});

const errorMappings = {
    [errorModel.GENERAL]: errorMessages,
    [errorModel.USER]: userErrorMessages,
};

const getErrorMessage = (code, model) => {
    const modelMessages = errorMappings[model] || {};
    return modelMessages[code] || 'Unknown Error';

};

const getErrorStatusWithMessage = (res, code, model) => {
    const errorMessage = getErrorMessage(code, model);
    res.status(code).json({ error: errorMessage });
};

const sendServerError = (res, model) => {
    const errorMessage = getErrorMessage(500, model);
    res.status(500).send(errorMessage);
};

module.exports = { getErrorMessage,  errorModel, getErrorStatusWithMessage, sendServerError};
