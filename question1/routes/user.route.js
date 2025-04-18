const express = require('express');
const controllers = require('../controller/user.controller');

const router = express.Router();



router.get('/users', controllers.getTopUsers);

router.get('/posts', controllers.getPosts);

export default router;