import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { PostController, UserController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.ogu7l1h.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("db connected"))
  .catch((error) => console.log("db error", error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.patch("/auth/me", checkAuth, handleValidationErrors, UserController.update);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/user/:id", UserController.getUserById);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.post("/posts/:id/comment", checkAuth, handleValidationErrors, PostController.createComment);

app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server work");
});
