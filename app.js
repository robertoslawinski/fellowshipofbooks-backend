require("dotenv").config();
require("./db"); //  MongoDB

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.json({ message: "📘 Welcome to The Fellowship of Books API" });
});


const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);


const bookRoutes = require("./routes/book.routes");
app.use("/api/books", bookRoutes);


const commentRoutes = require("./routes/comment.routes");
app.use("/api/comments", commentRoutes);

const uploadRoutes = require("./routes/upload.routes");
app.use("/api/upload", uploadRoutes);


app.use((err, req, res, next) => {
  console.error("🚨 Error middleware:", err);
  res.status(500).json({ errorMessage: "Internal Server Error" });
});

app.use("/uploads", express.static("uploads"));



module.exports = app;
