const router = require('express').Router();
const { Post } = require('../../models');

// Add a Post
router.post('/', async (req, rs) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            body: req.body.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a Post
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await Post.update(
            {
                title: req.body.title,
                body: req.body.body,
                user_id: req.session.user.id
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a Post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = Post.desroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;