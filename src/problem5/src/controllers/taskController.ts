import { Request, Response } from "express";
import {
  TaskModel,
  CreateTaskInput,
  UpdateTaskInput,
} from "../../src/models/Task";
import { NotFoundError } from "../errors/AppError";
import { err, ok } from "neverthrow";

export class TaskController {
  static async create(req: Request, res: Response): Promise<void> {
    const { name, description }: CreateTaskInput = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        message: "Name is required",
      });
      return;
    }

    TaskModel.create({ name: name.trim(), description })
      .map((task) => {
        res.status(201).json({
          message: "Task created successfully",
          data: task,
        });
      })
      .mapErr((error) => {
        res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
        });
      });
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    const {
      name,
      description,
      deletedAt = null,
      page = "1",
      limit = "10",
    } = req.query;

    const filters = {
      name: name as string | undefined,
      description: description as string | undefined,
      deletedAt: deletedAt as string | null,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
    };

    TaskModel.findAll(filters)
      .map(({ tasks, total }) => {
        const totalPages = Math.ceil(total / filters.limit);
        res.json({
          message: "Tasks retrieved successfully",
          data: tasks,
          pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages,
          },
        });
      })
      .mapErr((error) => {
        res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
        });
      });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Invalid task ID",
      });
      return;
    }

    TaskModel.findById(id)
      .andThen((task) => {
        if (task === null) {
          return err(new NotFoundError("Task", id));
        }
        return ok(task);
      })
      .match(
        (task) => {
          res.json({
            message: "Task retrieved successfully",
            data: task,
          });
        },
        (error) => {
          res.status(error.statusCode).json({
            error: error.code,
            message: error.message,
          });
        }
      );
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Invalid task ID",
      });
      return;
    }

    const { name, description }: UpdateTaskInput = req.body;

    if (name !== undefined && name.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        message: "Name cannot be empty",
      });
      return;
    }

    TaskModel.update(id, {
      name: name?.trim(),
      description,
    })
      .map((task) => {
        res.json({
          message: "Task updated successfully",
          data: task,
        });
      })
      .mapErr((error) => {
        res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
        });
      });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Invalid task ID",
      });
      return;
    }

    TaskModel.softDelete(id)
      .map((task) => {
        res.json({
          message: "Task deleted successfully",
          data: task,
        });
      })
      .mapErr((error) => {
        res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
        });
      });
  }
}
