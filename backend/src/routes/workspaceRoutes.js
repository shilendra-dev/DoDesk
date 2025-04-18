const express = require('express');
const {createWorkspace} = require('../controllers/workspaceController');
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.post("/create-workspace", protect, createWorkspace);

module.exports = router;