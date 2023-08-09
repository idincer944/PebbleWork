const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/create', authenticate, blogController.createNewBlog);
router.get('/', authenticate, blogController.getAllBlogs);
router.get('/:blogId', blogController.getBlogById);
router.put('/:blogId', authenticate, blogController.updatedBlog);

module.exports = router;
