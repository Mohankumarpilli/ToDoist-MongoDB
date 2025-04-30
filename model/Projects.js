const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
  {
    ProjectName: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    is_favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
