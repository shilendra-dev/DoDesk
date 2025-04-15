/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`create type users_role_enum as enum('admin', 'member')`);
    return knex.raw(`create table users 
              (
                  id uuid,
                  name text,
                  email text, 
                  password text,
                  role users_role_enum,
                  created_at timestamp default CURRENT_TIMESTAMP
      );`)
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
  
      await knex.raw(`drop table users`)
      return knex.raw(`drop type users_role_enum`)
  };
  