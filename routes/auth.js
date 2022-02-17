const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validateNewUserData, validateAuthData } = require('../middlewares/validation');

app.post('/api/signin', validateAuthData, login);
app.post('/api/signup', validateNewUserData, createUser);

module.exports = router;
