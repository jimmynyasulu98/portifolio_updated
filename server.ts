import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory password storage (in a real app, this would be a database)
  let adminPassword = process.env.VITE_ADMIN_PASSWORD || "admin";
  const RESET_KEY = process.env.PASSWORD_RESET_KEY || "password-reset-key-2026";

  // API Routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === adminPassword) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  app.post("/api/admin/reset-password", (req, res) => {
    const { resetKey, newPassword } = req.body;
    if (resetKey === RESET_KEY) {
      adminPassword = newPassword;
      res.json({ success: true, message: "Password reset successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid reset key" });
    }
  });

  app.post("/api/admin/change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (currentPassword === adminPassword) {
      adminPassword = newPassword;
      res.json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
