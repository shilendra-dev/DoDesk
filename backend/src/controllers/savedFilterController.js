const prisma = require("../lib/prisma");
const { createApi } = require("../utils/router");

// Get all saved filters for a user in a workspace
const getSavedFilters = async (req, res) => {
  const userId = req.user.id;
  const { workspace_id } = req.params;

  try {
    const filters = await prisma.savedFilter.findMany({
      where: {
        userId,
        workspaceId: workspace_id
      },
      orderBy: { createdAt: "desc" }
    });
    return {
      status: 200,
      message: "Saved filters fetched successfully",
      filters
    };
  } catch (error) {
    console.error("Error fetching saved filters:", error);
    return {
      status: 500,
      message: "Failed to fetch saved filters",
      error: error.message
    };
  }
};
createApi().get("/workspaces/:workspace_id/filters").authSecure(getSavedFilters);

// Create a new saved filter
const createSavedFilter = async (req, res) => {
  const userId = req.user.id;
  const { workspace_id } = req.params;
  const { name, filters, isDefault = false } = req.body;

  if (!name || !filters) {
    return { status: 400, message: "Name and filters are required" };
  }

  try {
    // If isDefault, unset previous default for this user/workspace
    if (isDefault) {
      await prisma.savedFilter.updateMany({
        where: { userId, workspaceId: workspace_id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const savedFilter = await prisma.savedFilter.create({
      data: {
        name,
        filters,
        isDefault,
        userId,
        workspaceId: workspace_id
      }
    });
    return {
      status: 201,
      message: "Saved filter created successfully",
      filter: savedFilter
    };
  } catch (error) {
    console.error("Error creating saved filter:", error);
    return {
      status: 500,
      message: "Failed to create saved filter",
      error: error.message
    };
  }
};
createApi().post("/workspaces/:workspace_id/filters").authSecure(createSavedFilter);

// Update a saved filter
const updateSavedFilter = async (req, res) => {
  const userId = req.user.id;
  const { filterId } = req.params;
  const { name, filters, isDefault } = req.body;

  if (!name && !filters && isDefault === undefined) {
    return { status: 400, message: "Nothing to update" };
  }

  try {
    // If isDefault, unset previous default for this user/workspace
    let filter = await prisma.savedFilter.findUnique({ where: { id: filterId } });
    if (!filter || filter.userId !== userId) {
      return { status: 404, message: "Saved filter not found" };
    }

    if (isDefault) {
      await prisma.savedFilter.updateMany({
        where: { userId, workspaceId: filter.workspaceId, isDefault: true },
        data: { isDefault: false }
      });
    }

    filter = await prisma.savedFilter.update({
      where: { id: filterId },
      data: {
        ...(name && { name }),
        ...(filters && { filters }),
        ...(isDefault !== undefined && { isDefault })
      }
    });
    return {
      status: 200,
      message: "Saved filter updated successfully",
      filter
    };
  } catch (error) {
    console.error("Error updating saved filter:", error);
    return {
      status: 500,
      message: "Failed to update saved filter",
      error: error.message
    };
  }
};
createApi().put("/filters/:filterId").authSecure(updateSavedFilter);

// Delete a saved filter
const deleteSavedFilter = async (req, res) => {
  const userId = req.user.id;
  const { filterId } = req.params;

  try {
    const filter = await prisma.savedFilter.findUnique({ where: { id: filterId } });
    if (!filter || filter.userId !== userId) {
      return { status: 404, message: "Saved filter not found" };
    }
    await prisma.savedFilter.delete({ where: { id: filterId } });
    return {
      status: 200,
      message: "Saved filter deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting saved filter:", error);
    return {
      status: 500,
      message: "Failed to delete saved filter",
      error: error.message
    };
  }
};
createApi().delete("/filters/:filterId").authSecure(deleteSavedFilter);

module.exports = {
  getSavedFilters,
  createSavedFilter,
  updateSavedFilter,
  deleteSavedFilter
};