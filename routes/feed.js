const express = require('express');

const { body } = require('express-validator');


// auth middleware
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const feedController = require('../controllers/feed');


// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post('/post', isAuth, 
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
    ], 
    feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

// put, patch has request body
router.put('/post/:postId', isAuth,   
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
    ], feedController.updatePost);

// delete
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;