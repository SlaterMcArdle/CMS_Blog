const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const withAuth = require('../utils/auth');

// Home Page
router.get('/', withAuth, async (req, res) => {
    try {
        const dbPosts = await Post.findAll({
            /* limit: 10,  */order: [['updatedAt', 'DESC']]
        });
        const posts = dbPosts.map((post) => {
            post.get({ plain: true });
        });
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// User Profile Page
router.get('/user/:id', withAuth, async (req, res) => {
    try {
        const dbUser = await User.findByPk(req.params.id, {
            include: [
                { 
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'body',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            ]
        });

        const user = dbUser.get({ plain: true });
        res.render('user', {
            user,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Specific Blog Post Page
router.get('/post:id', withAuth, async (req, res) => {
    try {
        const dbPost = Post.findByPk(req.params.id, {
            include: [
                {
                    model: 'comment',
                    where: {post_id: {$col: 'Post.id'}},
                    attributes: [
                        'id',
                        'user_id',
                        'createdAt',
                        'updatedAt',
                        'body'
                    ]
                },
                {
                    model: 'user',
                    where: {id: {$col: 'Comment.user_id'}},
                    attributes: [
                        'username'
                    ]
                }
            ]
        });

        const post = dbPost.get({ plain: true });
        res.render('post', {
            post,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Login Page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;