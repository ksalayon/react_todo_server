const jwt = require('jsonwebtoken');
const {getResponseStatusWithMessage, responseModel, sendServerError} = require("../../utility/responseMessages");

async function login(req, res) {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return getResponseStatusWithMessage(res, 401, responseModel.GENERAL);
        }

        const {shortLived, longLived} = await createTokens(user.id);
        res.cookie('llt', longLived, { httpOnly: true, secure: true, sameSite: 'Strict' })
        res.status(200).json({slt: shortLived});
    } catch  {
        sendServerError(res, responseModel.USER);
    }

}