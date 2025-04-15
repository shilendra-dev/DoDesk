/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`create type users_role_enum as enum('admin', 'member')`);
    await knex.raw(`
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          name TEXT,
          email TEXT, 
          password TEXT,
          role users_role_enum,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    
      return knex.raw(`
        CREATE TABLE tasks (
          taskId SERIAL PRIMARY KEY,
          taskTitle VARCHAR(255) NOT NULL,
          taskDescription TEXT,
          assignedTo UUID REFERENCES users(id) ON DELETE SET NULL,
          dueDate DATE,
          taskPriority VARCHAR(20) CHECK (taskPriority IN ('Low', 'Medium', 'High')),
          taskStatus VARCHAR(20) DEFAULT 'Pending' CHECK (taskStatus IN ('Pending', 'In Progress', 'Done')),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
  
      await knex.raw(`DROP TABLE IF EXISTS tasks;`)
      await knex.raw(`DROP TABLE IF EXISTS users;`)
      return knex.raw(`DROP TYPE IF EXISTS users_role_enum;`)
  };
  