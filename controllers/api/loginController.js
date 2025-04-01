const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const {getResponseStatusWithMessage, responseModel, sendServerError} = require("../../utility/responseMessages");
const {createTokens} = require("../tokensController");

async function login(req, res) {
    const {email, password: reqPassword} = req.body;
    try {
        const { rows } = await pool.query('SELECT users.id, users.name, users.email, ' +
            'users.created, users.role_id, users.password,' +
            'roles.name as role' +
            ' FROM users ' +
            ' LEFT JOIN  roles ' +
            ' ON users.role_id = roles.id ' +
            'WHERE users.email = $1', [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(reqPassword, user.password))) {
            return getResponseStatusWithMessage(res, 401, responseModel.GENERAL);
        }

        const {shortLived, longLived} = await createTokens(user.id);
        res.cookie('llt', longLived, { httpOnly: true, secure: true, sameSite: 'Strict' });
        const { password, ...safeUser } = user;
        const responseData = {...safeUser, slt: shortLived};
        res.status(200).json(responseData);
    } catch (error)  {
        console.log('login error', error);
        sendServerError(res, responseModel.USER);
    }

}
module.exports = { login };