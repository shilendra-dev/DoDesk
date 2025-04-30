const express = require('express')
const {createTask, getTasksByWorkspace, updateTask, deleteTask, assignTask} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/',protect , createTask);
router.get('/:workspace_id', protect, getTasksByWorkspace)
router.put('/:taskId', protect, updateTask)
router.delete('/:taskId', protect, deleteTask)

router.post('/:taskId/assign', protect, assignTask);

module.exports = router;