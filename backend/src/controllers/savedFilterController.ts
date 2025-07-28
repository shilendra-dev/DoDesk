import prisma from '../lib/prisma';
import { createApi } from '../utils/router';
import {
  CreateSavedFilterRequest,
  CreateSavedFilterResponse,
  GetSavedFiltersResponse,
  UpdateSavedFilterRequest,
  UpdateSavedFilterResponse
} from '../types/controllers/filter.types';
import {
  ControllerFunction,
  AuthenticatedRequest,
  WorkspaceRequest,
  FilterRequest
} from '../types/controllers/base.types';

// GET ALL SAVED FILTERS FOR A USER IN A WORKSPACE
const getSavedFilters: ControllerFunction<GetSavedFiltersResponse> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { workspace_id } = (req as WorkspaceRequest).params;

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
      data: { filters }
    };
  } catch (error) {
    console.error("Error fetching saved filters:", error);
    return {
      status: 500,
      message: "Failed to fetch saved filters",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().get("/workspaces/:workspace_id/filters").authSecure(getSavedFilters);

// CREATE A NEW SAVED FILTER
const createSavedFilter: ControllerFunction<CreateSavedFilterResponse> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { workspace_id } = (req as WorkspaceRequest).params;
  const { name, filters, isDefault = false }: CreateSavedFilterRequest = req.body;

  if (!name || !filters) {
    return { 
      status: 400, 
      message: "Name and filters are required" 
    };
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
      data: { filter: savedFilter }
    };
  } catch (error) {
    console.error("Error creating saved filter:", error);
    return {
      status: 500,
      message: "Failed to create saved filter",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().post("/workspaces/:workspace_id/filters").authSecure(createSavedFilter);

// UPDATE A SAVED FILTER
const updateSavedFilter: ControllerFunction<UpdateSavedFilterResponse> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { filterId } = (req as FilterRequest).params;
  const { name, filters, isDefault }: UpdateSavedFilterRequest = req.body;

  if (!filterId) {
    return {
      status: 400,
      message: "Filter ID is required"
    };
  }

  if (!name && !filters && isDefault === undefined) {
    return { 
      status: 400, 
      message: "Nothing to update" 
    };
  }

  try {
    // If isDefault, unset previous default for this user/workspace
    let filter = await prisma.savedFilter.findUnique({ where: { id: filterId } });
    if (!filter || filter.userId !== userId) {
      return { 
        status: 404, 
        message: "Saved filter not found" 
      };
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
      data: { filter }
    };
  } catch (error) {
    console.error("Error updating saved filter:", error);
    return {
      status: 500,
      message: "Failed to update saved filter",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().put("/filters/:filterId").authSecure(updateSavedFilter);

// DELETE A SAVED FILTER
const deleteSavedFilter: ControllerFunction<any> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { filterId } = (req as FilterRequest).params;

  if (!filterId) {
    return {
      status: 400,
      message: "Filter ID is required"
    };
  }

  try {
    const filter = await prisma.savedFilter.findUnique({ where: { id: filterId } });
    if (!filter || filter.userId !== userId) {
      return { 
        status: 404, 
        message: "Saved filter not found" 
      };
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
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().delete("/filters/:filterId").authSecure(deleteSavedFilter);

// Export for testing
export {
  getSavedFilters,
  createSavedFilter,
  updateSavedFilter,
  deleteSavedFilter
}; 