const express = require('express');

const router = express.Router();
const {registerUser} = require('../Controllers/UserController');

router.post('/register', registerUser);

module.exports= router;