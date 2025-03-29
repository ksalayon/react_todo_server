const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const {getResponseStatusWithMessage, responseModel, sendServerError} = require("../../utility/responseMessages");
const {createTokens} = require("../tokensController");

async function login(req, res) {
    const {email, password} = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return getResponseStatusWithMessage(res, 401, responseModel.GENERAL);
        }

        const {shortLived, longLived} = await createTokens(user.id);
        res.cookie('llt', longLived, { httpOnly: true, secure: true, sameSite: 'Strict' })
        res.status(200).json({slt: shortLived, user});
    } catch (error)  {
        sendServerError(res, responseModel.USER);
    }

}
module.exports = { login };