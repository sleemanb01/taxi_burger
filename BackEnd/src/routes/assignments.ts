import express from "express";
import { check } from "express-validator";
import {
  getAssignments,
  getAssignment,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment";
import { authenticate } from "../middleware/auth";
import { fileUpload } from "../middleware/file-upload";

/* ************************************************************** */

export const assignmentsRoutes = express.Router();

assignmentsRoutes.get("/", getAssignments);

assignmentsRoutes.use(authenticate);

assignmentsRoutes.get("/:assignmentId", getAssignment);

assignmentsRoutes.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  addAssignment
);

assignmentsRoutes.patch(
  "/:assignmentId",
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  updateAssignment
);

assignmentsRoutes.delete("/:assignmentId", deleteAssignment);
