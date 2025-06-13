const express = require("express");
const router = express.Router();
const savedFilterController = require("../controllers/savedFilterController");
const {protect} = require("../middleware/authMiddleware");

//get all saved filters
router.get("/:workspace_id", protect, savedFilterController.getSavedFilters);

//get default filter
router.get("/:workspace_id/default", protect, savedFilterController.getDefaultFilter);

//save a new filter
router.post("/:workspace_id", protect, savedFilterController.saveFilter);

//delete a filter
router.delete("/:workspace_id/:filter_id", protect, savedFilterController.deleteFilter);

//set a filter as default
router.put("/:workspace_id/:filter_id/default", protect, savedFilterController.setDefaultFilter);

module.exports = router;