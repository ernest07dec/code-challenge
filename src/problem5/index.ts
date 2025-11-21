import express, { Request, Response, NextFunction } from "express";
import taskRoutes from "./src/routes/taskRoutes";
import { seedDatabase } from "./database/seed";
import { getReadmeHtml } from "./src/helpers/renderMarkdown";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  try {
    const html = getReadmeHtml();
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error: any) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to read README.md",
    });
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/tasks", taskRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

try {
  seedDatabase();
} catch (error: any) {
  console.error("Failed to seed database:", error.message);
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
