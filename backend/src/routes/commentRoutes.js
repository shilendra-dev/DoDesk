const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

router.get('/tasks/:taskId/comments', protect, commentController.getComments);
router.post('/tasks/:taskId/comments', protect, commentController.createComment);
router.patch('/comments/:id', protect, commentController.updateComment);
router.delete('/comments/:id', protect, commentController.deleteComment);

module.exports = router;