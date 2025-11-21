import db from "./db";
import { TaskModel } from "../src/models/Task";

const seedTasks = [
  {
    name: "Complete project documentation",
    description:
      "Write comprehensive documentation for the Express API project",
  },
  {
    name: "Implement user authentication",
    description:
      "Add JWT-based authentication system with login and registration",
  },
  {
    name: "Write unit tests",
    description: "Create test cases for all API endpoints using Jest",
  },
  {
    name: "Setup CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
  },
  {
    name: "Optimize database queries",
    description: "Review and optimize SQL queries for better performance",
  },
];

export function seedDatabase(): void {
  try {
    // Check if tasks already exist
    const countStmt = db.prepare("SELECT COUNT(*) as count FROM tasks");
    const result = countStmt.get() as { count: number };

    if (result.count > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }

    console.log("Seeding database with initial tasks...");

    let successCount = 0;
    let errorCount = 0;

    seedTasks.forEach((task) => {
      TaskModel.create(task)
        .map(() => {
          successCount++;
        })
        .mapErr((error) => {
          errorCount++;
          console.error(`Failed to create task "${task.name}":`, error.message);
        });
    });

    if (errorCount === 0) {
      console.log(`Successfully seeded ${successCount} tasks.`);
    } else {
      console.warn(
        `Seeded ${successCount} tasks, but ${errorCount} tasks failed.`
      );
    }
  } catch (error: any) {
    console.error("Error seeding database:", error.message);
    throw error;
  }
}
