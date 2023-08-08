const Blog = require('../models/blog');
// const { validateComment } = require('../utils/validations');

module.exports = {

    createNewBlog:async(req,res)=>{
        const{title,content}=req.body;
        try{ 
        const author = req.user.user_id;
        const Newblog=Blog({title,content,author});
        const savedBlog=await Newblog.save();
        res.status(201).json(savedBlog); // Success status code 201 - Created
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error while creating blog'); // Failure status code 500
    }
        res.send("Hello Word");
    }

};