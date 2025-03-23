const pool = require('../../config/db');
const {responseModel, sendServerError, getResponseStatusWithMessage} = require("../../utility/responseMessages");

// 🟢 GET all users
const getUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        sendServerError(res, responseModel.USER);
    }
};

// 🟢 GET a single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) return getResponseStatusWithMessage(res, 404, responseModel.USER);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        sendServerError(res, responseModel.USER);
    }
};

// 🟢 POST - Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return getResponseStatusWithMessage(res, 409, responseModel.USER);
        }
        sendServerError(res, responseModel.USER);
    }
};

// 🟢 PUT - Update a user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        if (updatedUser.rows.length === 0) {
            return getResponseStatusWithMessage(res, 404, responseModel.USER);
        }
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        sendServerError(res, responseModel.USER);
    }
};

// 🟢 DELETE - Remove a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (deletedUser.rows.length === 0) return getResponseStatusWithMessage(res, 404, responseModel.USER);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        sendServerError(res, responseModel.USER);
    }
};



module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };