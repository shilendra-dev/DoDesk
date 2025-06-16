const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const subtaskController = require('../controllers/subtaskController');

router.get('/tasks/:taskId/subtasks', protect, subtaskController.getSubtasks);
router.post('/tasks/:taskId/subtasks', protect, subtaskController.createSubtask);
router.patch('/subtasks/:id', protect, subtaskController.updateSubtask);
router.delete('/subtasks/:id', protect, subtaskController.deleteSubtask);

module.exports = router;