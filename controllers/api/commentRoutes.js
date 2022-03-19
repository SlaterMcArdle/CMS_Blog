const router = require('express').Router();
const { Comment } = require('../../models');

// Add a Post
router.post('/', async (req, rs) => {
    try {
        const newComment = await Comment.create({
            title: req.body.title,
            body: req.body.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a Post
router.put('/:id', async (req, res) => {
    try {
        const updatedComment = await Comment.update(
            {
                body: req.body.body,
                post_id: req.body.post_id,
                user_id: req.session.user.id
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a Post
router.delete('/:id', async (req, res) => {
    try {
        const deletedComment = Comment.desroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(deletedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;