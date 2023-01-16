import express from "express";
import { check } from "express-validator";
import { fileUpload } from "../middleware/file-upload";
import { authenticate } from "../middleware/auth";
import {
  getStock,
  addStock,
  updateStock,
  deleteStock,
} from "../controllers/stock";

/* ************************************************************** */

export const stockRoutes = express.Router();

stockRoutes.get("/", getStock);

stockRoutes.use(authenticate);

stockRoutes.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("quantity").isNumeric().isLength({ min: 0, max: 100 }),
  ],
  addStock
);

stockRoutes.patch(
  "/:stockId",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("quantity").isNumeric().isLength({ min: 0, max: 100 }),
  ],
  updateStock
);

stockRoutes.delete("/:placeId", deleteStock);
