const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');
const router = express.Router();
const blogController = require('../controllers/blogController');


router.post('/create',authenticate, blogController.createNewBlog);
router.get('/',authenticate, blogController.getAllBlogs);


module.exports = router;
