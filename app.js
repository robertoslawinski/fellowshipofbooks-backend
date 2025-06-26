require("dotenv").config();
require("./db"); // conexão com o MongoDB

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "📘 Welcome to The Fellowship of Books API" });
});

// Rotas de autenticação (signup, login, verify)
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Rotas de livros (favoritar, remover, listar)
const bookRoutes = require("./routes/book.routes");
app.use("/api/books", bookRoutes);

// Rotas de comentários (criar, listar, editar, deletar)
const commentRoutes = require("./routes/comment.routes");
app.use("/api/comments", commentRoutes);

const uploadRoutes = require("./routes/upload.routes");
app.use("/api/upload", uploadRoutes);

// Middleware de erro (opcional para customização futura)
app.use((err, req, res, next) => {
  console.error("🚨 Error middleware:", err);
  res.status(500).json({ errorMessage: "Internal Server Error" });
});

app.use("/uploads", express.static("uploads"));



module.exports = app;
