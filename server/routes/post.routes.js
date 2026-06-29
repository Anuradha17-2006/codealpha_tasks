const express = require('express');
const { authenticate } = require('../middleware/auth');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.getPosts);
router.post('/', authenticate, postController.createPost);
router.get('/:id', postController.getPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/bookmark', authenticate, postController.bookmarkPost);

module.exports = router;
