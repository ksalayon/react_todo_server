const pool = require('../../config/db');
const {getResponseStatusWithMessage, responseModel, sendServerError} = require("../../utility/responseMessages");


async function signup(req, res) {
    const { name, email, password} = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const activationHash = crypto.randomBytes(32).toString('hex');
        await pool.query(
            'INSERT INTO users (name, email, password, activation_hash) VALUES ($1, $2, $3, $4)',
            [name, email, passwordHash, activationHash]
        );
        res.status(201).json({created: true});
    } catch (err) {
        sendServerError(res, responseModel.USER);
    }
}

async function activate(req, response) {
    const {activation_hash} = req.body;
    try {
        const user = await pool.query('SELECT 1 FROM users WHERE activation_hash = $1', [activation_hash]);
        if (!user) {
            return getResponseStatusWithMessage(res, 404, responseModel.SIGNUP);
        }
        res.status(200).json({success: true});

    } catch {
        sendServerError(res, responseModel.USER);
    }
}