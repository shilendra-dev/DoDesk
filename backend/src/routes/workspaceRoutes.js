const express = require('express');
const {createWorkspace, getUserWorkspaces, inviteMember, getWorkspaceMembers} = require('../controllers/workspaceController');
const {protect} = require('../middleware/authMiddleware');


const router = express.Router();

router.post("/create-workspace", protect, createWorkspace);
router.get("/", protect, getUserWorkspaces);
router.post('/:workspace_id/invite', protect, inviteMember)
router.get("/:workspace_id/members", protect, getWorkspaceMembers)

module.exports = router;