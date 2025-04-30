const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/User");
require("dotenv").config();
const Project = require("./model/Projects");
const Task = require("./model/Tasks");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Heloo from express");
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const Tasks = await Task.find();
    res.status(200).json(Tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/user", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const Projects = await Project.find();
    res.status(200).json(Projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/project", async (req, res) => {
  const { ProjectName, userId, color } = req.body;

  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(400).json({ error: "User does not exist" });
  }

  const newProject = new Project({
    ProjectName,
    user: userId,
    color,
  });

  await newProject.save();

  res.status(201).json(newProject);
});

app.post("/api/task", async (req, res) => {
  try {
    const { project_id, content, description, due_date } = req.body;
    if (!project_id || !content) {
      return res
        .status(400)
        .json({ error: "project_id and content are required." });
    }
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }
    const newTask = new Task({
      project_id,
      content,
      description: description || null,
      due_date: due_date || null,
    });

    await newTask.save();

    return res.status(201).json(newTask);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Task content must be unique." });
    }
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database is connected");
    app.listen(process.env.PORT, () => {
      console.log("server is running at port", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("connection failed");
  });
