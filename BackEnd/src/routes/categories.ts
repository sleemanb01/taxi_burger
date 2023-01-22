import express from "express";
import { check } from "express-validator";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categories";
import { authenticate } from "../middleware/auth";

/* ************************************************************** */

export const categoriesRoutes = express.Router();

categoriesRoutes.get("/", getCategories);

categoriesRoutes.use(authenticate);

categoriesRoutes.post("/", [check("name").not().isEmpty()], addCategory);

categoriesRoutes.patch(
  "/:categoryId",
  [check("name").not().isEmpty()],
  updateCategory
);

categoriesRoutes.delete("/:categoryId", deleteCategory);
