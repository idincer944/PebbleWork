const Blog = require('../models/blog');
const { validateBlog } = require('../utils/validations');
// const { validateComment } = require('../utils/validations');

module.exports = {
  createNewBlog : async(req,res) =>{
  const validationResult = validateBlog(req.body);
  if (validationResult.error) 
  {
      // Validation failed, handle the error with custom messages
      const errorMessages = validationResult.error.details.map(
        (error) => error.message);
      return res.status(400).json({ errors: errorMessages });
  }
  const { title,content }= validationResult.value;
  const author = req.user.user_id;
  try{
    const Newblog=Blog({title,content,author});
      const savedBlog=await Newblog.save();
      res.status(201).json(savedBlog); // Success status code 201 - Created
    }
    catch (error) { 
      console.error(error);
      res.status(500).send('Internal Server Error while creating blog');
    } // Failure status code 500
  },
    
  getAllBlogs : async(req,res) => {
    try {
      const blogs = await Blog.find({}).populate({
          path: 'author',
          select: 'title image'});
      res.status(200).send(blogs);
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
    },
  getBlogById : async (req, res) => {
    const { blogId } = req.params;
    try {
      const blog = await Blog.findById(blogId).populate({
        path: 'author',
        select: 'title',
      });
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json(blog);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

};