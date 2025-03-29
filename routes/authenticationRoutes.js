const express = require('express');
const {login} = require("../controllers/api/loginController");

const router = express.Router();

router.post('/', login);

module.exports = router;