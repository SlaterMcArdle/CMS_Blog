const router = require('express').Router();
const users = require('./userRoutes');
const posts = require('./postRoutes');
const comments = require('./commentRoutes');

router.use('/users', users);
router.use('/posts', posts);
router.use('/comments', comments);

module.exports = router;