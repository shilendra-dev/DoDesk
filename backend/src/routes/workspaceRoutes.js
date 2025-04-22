const express = require('express');
const {createWorkspace, getUserWorkspaces} = require('../controllers/workspaceController');
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/create-workspace", protect, createWorkspace);
router.get("/", protect, getUserWorkspaces);

module.exports = router;