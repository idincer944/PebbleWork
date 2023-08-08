const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');
const router = express.Router();
const blogController = require('../controllers/blogController');


router.post('/create',authenticate, blogController.createNewBlog);


module.exports = router;
