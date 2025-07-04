const { v4: uuidv4, validate } = require("uuid");
const pool = require("../config/db");
const { createApi } = require("../utils/router");

//create task or CREATE
const createTask = async (req, res) => {
  const {
    title,
    description,
    status = "pending",
    priority = "mid",
    due_date,
    workspace_id,
  } = req.body;

  const created_by = req.user?.id;
  const id = uuidv4();

  try {
    const result = await pool.query(
      `INSERT INTO tasks
            (id, title, description, status, priority, due_date, workspace_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
      [
        id,
        title,
        description,
        status, 
        priority,
        due_date,
        workspace_id,
        created_by,
      ]
    );

    const createdTask = result.rows[0];

    const userResult = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [created_by]
    );

    const created_by_name = userResult.rows[0]?.name || null;

    //res.status(201).json({ ...createdTask, created_by_name });

    return {
      status: 201,
      message: "Task created successfully",
      task: {
        ...createdTask,
        created_by_name,
      }
}
  } catch (error) {
    console.error("Error creating task: ", error);
    return {
      status: 500,
      message: "Failed to create task",
      error: error.message
    };
  }
};
createApi().post("/workspaces/:workspace_id/task").authSecure(createTask); // for creating a new task

//fetch task or READ
const getTasksByWorkspace = async (req, res) => {
  const { workspace_id } = req.params;
  const isValidUuid = validate(workspace_id);

  if (!isValidUuid) return res.status(401).json({ message: "invalid uuid" });

  try {
    const result = await pool.query(
      `SELECT 
        tasks.*, 
        users.name AS created_by_name 
      FROM tasks 
      JOIN users ON tasks.created_by = users.id 
      WHERE tasks.workspace_id = $1 
      ORDER BY tasks.created_at DESC`,
      [workspace_id]
    );

    const tasks = result.rows;

    // Fetch assignees for all tasks in a single query
    const taskIds = tasks.map(task => task.id);
    let assigneeMap = {};

    if (taskIds.length > 0) {
      const assigneesResult = await pool.query(
        `SELECT 
          ta.task_id, 
          u.id AS user_id, 
          u.name 
        FROM task_assignees ta
        JOIN users u ON ta.user_id = u.id
        WHERE ta.task_id = ANY($1::uuid[])`,
        [taskIds]
      );

      assigneeMap = assigneesResult.rows.reduce((map, row) => {
        if (!map[row.task_id]) map[row.task_id] = [];
        map[row.task_id].push({ id: row.user_id, name: row.name });
        return map;
      }, {});
    }

    // Add assignees to each task
    const tasksWithAssignees = tasks.map(task => ({
      ...task,
      assignees: assigneeMap[task.id] || [],
      notes: task.notes || "",
    }));

    // res.json(tasksWithAssignees);
    return {
      status: 200,
      message: "Tasks fetched successfully",
      tasks: tasksWithAssignees
    }
  } catch (error) {
    console.log("Error fetching tasks: ", error);
    return {
      status: 500,
      message: "Failed fetching tasks",
      error: error.message
    };
  }
};
createApi().get("/workspace/:workspace_id/tasks").authSecure(getTasksByWorkspace); // for fetching tasks by workspace

//edit task or UPDATE
const updateTask = async (req, res) => {
  if (!req.params || !req.body) {
    return res.status(400).json({ message: "Task ID and update data required" });
  }
  const { taskId } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks
            SET title = $1, description = $2, status = $3, priority = $4, due_date = $5
            WHERE id = $6 
            RETURNING *`,
      [title, description, status, priority, due_date, taskId]
    );
    if (result.rows.length === 0) {
      //return res.status(404).json({ message: "Task not found" });
      return {
        status: 404,
        message: "Task not found",
      };
    }
    //res.status(200).json(result.rows[0]);
    return {
      status: 200,
      message: "Task updated successfully",
      task: result.rows[0],
    };
  } catch (error) {
    console.error("Error updating task: ", error);
    return {
      status: 500,
      message: "Failed to update tasks",
      error: error.message
    };
  }
};
createApi().put("/task/:taskId").authSecure(updateTask); // for updating a task

//delete task or DELETE
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING *`,
      [taskId]
    );
    if (result.rows.length === 0) {
      //return res.status(404).json({ message: "Task not found" });
      return {
        status: 404,
        message: "Task not found",
      }
    }
    //res.status(200).json({ message: "Task deleted successfully" });
    return {
      status: 200,
      message: "Task deleted successfully",
      task: result.rows[0],
    };
  } catch (error) {
    console.error("Error deleting tasks:", error);
    return {
      status: 500,
      message: "Failed to delete task",
      error: error.message
    };
  }
};
createApi().delete("/task/:taskId").authSecure(deleteTask); // for deleting a task

const assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { assignees } = req.body;

  if (!Array.isArray(assignees) || assignees.length === 0) {
    return res.status(400).json({ error: "Assignees list required" });
  }

  try {
    // Check if task exists
    const taskResult = await pool.query(
      `SELECT workspace_id FROM tasks WHERE id=$1`,
      [taskId]
    );
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const workspace_id = taskResult.rows[0].workspace_id;

    // Validate if assignees exist in the users table
    const validAssigneesResult = await pool.query(
      `SELECT id FROM users WHERE id = ANY($1::uuid[])`,
      [assignees]
    );

    const validAssignees = validAssigneesResult.rows.map((row) => row.id);
    const invalidAssignees = assignees.filter(
      (id) => !validAssignees.includes(id)
    );

    if (invalidAssignees.length > 0) {
      // return res.status(400).json({
      //   error: `Invalid assignees: ${invalidAssignees.join(", ")}`,
      // });
      return {
        status: 400,
        message: `Invalid assignees: ${invalidAssignees.join(", ")}`,
      };
    }

    // Avoid duplicates: checking if already assigned
    const alreadyAssignedResult = await pool.query(
      `SELECT user_id FROM task_assignees WHERE task_id = $1 AND user_id = ANY($2::uuid[])`,
      [taskId, assignees]
    );
    const alreadyAssignedIds = alreadyAssignedResult.rows.map(
      (row) => row.user_id
    );

    const newAssignees = assignees.filter(
      (id) => !alreadyAssignedIds.includes(id)
    );

    if (newAssignees.length === 0) {
      //return res.status(409).json({ error: "Assignees already exist" });
      return {
        status: 409,
        message: "Assignees already exist",
      };
    }

    // Generate UUID for each assignee
    const assigneeIds = newAssignees.map(() => uuidv4());

    // Insert new assignees with generated UUIDs
    const insertQuery = `INSERT INTO task_assignees (id, task_id, user_id) VALUES 
            ${newAssignees.map((_, idx) => `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3})`).join(", ")}
        `;

    // Flatten the values into a single array for the query
    const values = [];
    newAssignees.forEach((user, idx) => {
      values.push(assigneeIds[idx], taskId, user);
    });

    // Execute the query
    await pool.query(insertQuery, values);

    //res.json({ message: "New assignees added", newAssignees });
    return {
      status: 200,
      message: "New assignees added",
      newAssignees: newAssignees.map((id, idx) => ({
        id: assigneeIds[idx],
        user_id: id,
        task_id: taskId,
        workspace_id: workspace_id
      }))
    };
  } catch (error) {
    console.error("Error assigning task:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message
    };
  }
};
createApi().post("/task/:taskId/assign").authSecure(assignTask); // for assigning a task to users

const removeAssignee = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  if(!taskId || !userId) {
    //return res.status(400).json({ error: "Task ID and User ID are required" });
    return {
      status: 400,
      message: "Task ID and User ID are required",
    }
  }

  try{
    const result = await pool.query(
      `DELETE FROM task_assignees WHERE task_id = $1 AND user_id = $2 RETURNING *`,
      [taskId, userId]
    );
    if(result.rows.length === 0) {
      //return res.status(404).json({ message: "Assignee not found for this task" });
      return {
        status: 404,
        message: "Assignee not found for this task",
      };
    }
    return {
      status: 200,
      message: "Assignee removed successfully",
      assignee: result.rows[0],
    };
  }catch (error) {
    console.error("Error removing assignee:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message
    };
  }
}
createApi().delete("/task/:taskId/removeAssignee").authSecure(removeAssignee); // for removing an assignee from a task

// to update note for a task
const updateTaskNotes = async (req, res) => {
  const { taskId } = req.params;
  const { notes } = req.body;

  // Validate taskId and notes
  if(!taskId || !notes) {
    
    return {
      status: 400,
      message: "Task ID and notes are required",
    }
  }

  try {
    const result = await pool.query(
      `UPDATE tasks
            SET notes = $1, updated_at = NOW()
            WHERE id = $2 
            RETURNING *`,
      [notes, taskId]
    );
    if (result.rows.length === 0) {
      return {
        status: 404,
        message: "Task not found",
      };
    }
    return {
      status: 200,
      message: "Task notes updated successfully",
      task: result.rows[0],
    };
  }catch(error) {
    console.error("Error updating task notes: ", error);
    return {
      status: 500,
      message: "Failed to update task notes",
      error: error.message
    };
  }
}
createApi().put("/task/:taskId/notes").authSecure(updateTaskNotes); // for updating task notes
