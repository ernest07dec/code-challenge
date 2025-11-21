import fs from "fs";
import path from "path";
import { marked } from "marked";

/**
 * Renders a markdown file to styled HTML
 * @param markdownFilePath Path to the markdown file
 * @returns HTML string with embedded styles
 */
export function renderMarkdownToHtml(markdownFilePath: string): string {
  const markdown = fs.readFileSync(markdownFilePath, "utf-8");
  const html = marked(markdown);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Problem 5: ExpressJS Backend Server</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 5px;
    }
    h3 {
      color: #555;
      margin-top: 20px;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #282c34;
      color: #abb2bf;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #61afef;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #3498db;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    blockquote {
      border-left: 4px solid #3498db;
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-style: italic;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    li {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    ${html}
  </div>
</body>
</html>
  `;
}

/**
 * Gets the README HTML for the root route
 * @returns HTML string with README content
 */
export function getReadmeHtml(): string {
  // Use process.cwd() for ts-node compatibility and respect rootDir from tsconfig
  const readmePath = path.join(process.cwd(), "README.md");
  return renderMarkdownToHtml(readmePath);
}
