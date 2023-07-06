const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const EmailValidator = require("email-validator");



router.get('/all', async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

router.post('/signin', async (req, res) => {
    const {username, password, rememberMe} = req.body;
    const user = await User.findOne({username});
    if(!user) {
        return res.status(400).json({error: 'Wrong username or password'})
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return res.status(400).json({error: 'Wrong username or password'})
    }

    res.setHeader('user', user.id)
    if(rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
    }

    req.session.user = user;
    res.json(user)
   // res.redirect('/'); // !!!home page or profile page needs to be decided!!!
});

router.post('/signup', async (req, res) => {
    const {
        firstname,
        lastname,
        username,
        password,
        password2,
        email,
        acceptTos,
        avatar,
    } = req.body;

    if (password !== password2) {
        return res.status(400).json({error: 'Passwords do not match'}) //change json to render and add the route
    }

    if(!acceptTos) {
        return res.status(400).json( {error: 'You must accept the Terms of Service'}) //change json to render and add the route
    }

    let user = await User.findOne({username});
    if(user) {
        return res.status(400).json({error: 'Username already exists'})//change json to render and add the route
    }

    if(EmailValidator.validate(email) === false) {
        return res.status(400).json({error: 'Invalid email'})//change json to render and add the route
    }

    const password_hash = await bcrypt.hash(password, 10);

    user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password_hash,
        avatar,
    })

    req.session.user = user;
    res.redirect('/'); // !!!home page or profile page needs to be decided!!!
    
});

router.get('/signout', authenticate, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//jsons sign up page
router.get('/signup', (req, res) => {
    if (!req.session?.user) res.json('user/signup');//change json to render and add the route
    else res.redirect('/');
});

// jsons sign in page
router.get('/signin', (req, res) => {
    if (!req.session?.user) res.json('user/signin');//change json to render and add the route
    else res.redirect('/');
});

module.exports = router;