import { Result, ok, err } from "neverthrow";
import db from "../../database/db";
import { NotFoundError, DatabaseError, AppError } from "../errors/AppError";

export interface Task {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreateTaskInput {
  name: string;
  description?: string;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
}

export interface TaskFilters {
  name?: string;
  description?: string;
  deletedAt?: string | null;
  page?: number;
  limit?: number;
}

export class TaskModel {
  static create(data: CreateTaskInput): Result<Task, AppError> {
    try {
      const stmt = db.prepare(`
        INSERT INTO tasks (name, description, createdAt)
        VALUES (?, ?, datetime('now'))
      `);
      const result = stmt.run(data.name, data.description || null);
      const taskId = result.lastInsertRowid as number;

      return this.findById(taskId).andThen((task) => {
        if (!task) {
          return err(new DatabaseError("Failed to retrieve created task"));
        }
        return ok(task);
      });
    } catch (error: any) {
      return err(new DatabaseError("Failed to create task", error));
    }
  }

  static findById(id: number): Result<Task | null, AppError> {
    try {
      const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
      const task = stmt.get(id) as Task | null;
      return ok(task);
    } catch (error: any) {
      return err(new DatabaseError("Failed to find task by id", error));
    }
  }

  static findAll(
    filters: TaskFilters = {}
  ): Result<{ tasks: Task[]; total: number }, AppError> {
    try {
      const {
        name,
        description,
        deletedAt = null,
        page = 1,
        limit = 10,
      } = filters;

      let whereConditions: string[] = [];
      let params: any[] = [];

      if (deletedAt === null || deletedAt === undefined) {
        whereConditions.push("deletedAt IS NULL");
      } else if (deletedAt === "") {
      } else {
        whereConditions.push("deletedAt IS NOT NULL");
      }

      if (name) {
        whereConditions.push("name LIKE ?");
        params.push(`%${name}%`);
      }

      if (description) {
        whereConditions.push("description LIKE ?");
        params.push(`%${description}%`);
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const countStmt = db.prepare(
        `SELECT COUNT(*) as total FROM tasks ${whereClause}`
      );
      const total = (countStmt.get(...params) as { total: number }).total;

      const offset = (page - 1) * limit;
      const selectStmt = db.prepare(`
        SELECT * FROM tasks
        ${whereClause}
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `);
      const tasks = selectStmt.all(...params, limit, offset) as Task[];

      return ok({ tasks, total });
    } catch (error: any) {
      return err(new DatabaseError("Failed to find tasks", error));
    }
  }

  static update(id: number, data: UpdateTaskInput): Result<Task, AppError> {
    return this.findById(id).andThen((existing) => {
      if (!existing) {
        return err(new NotFoundError("Task", id));
      }

      const updates: string[] = [];
      const params: any[] = [];

      if (data.name !== undefined) {
        updates.push("name = ?");
        params.push(data.name);
      }

      if (data.description !== undefined) {
        updates.push("description = ?");
        params.push(data.description);
      }

      if (updates.length === 0) {
        return ok(existing);
      }

      try {
        updates.push("updatedAt = datetime('now')");
        params.push(id);

        const stmt = db.prepare(`
            UPDATE tasks
            SET ${updates.join(", ")}
            WHERE id = ?
          `);
        stmt.run(...params);

        return this.findById(id).andThen((updated) => {
          if (!updated) {
            return err(new DatabaseError("Failed to retrieve updated task"));
          }
          return ok(updated);
        });
      } catch (error: any) {
        return err(new DatabaseError("Failed to update task", error));
      }
    });
  }

  static softDelete(id: number): Result<Task, AppError> {
    return this.findById(id).andThen((existing) => {
      if (!existing) {
        return err(new NotFoundError("Task", id));
      }

      try {
        const stmt = db.prepare(`
            UPDATE tasks
            SET deletedAt = datetime('now')
            WHERE id = ?
          `);
        stmt.run(id);

        return this.findById(id).andThen((deleted) => {
          if (!deleted) {
            return err(
              new DatabaseError("Failed to retrieve soft-deleted task")
            );
          }
          return ok(deleted);
        });
      } catch (error: any) {
        return err(new DatabaseError("Failed to soft delete task", error));
      }
    });
  }
}
