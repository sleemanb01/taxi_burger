import express from "express";
import { check } from "express-validator";
import { fileUpload } from "../middleware/file-upload";
import { authenticate } from "../middleware/auth";
import {
  getStock,
  getStocks,
  addStock,
  updateStock,
  deleteStock,
  updateStockWImage,
} from "../controllers/stock";

/* ************************************************************** */

export const stockRoutes = express.Router();

stockRoutes.get("/", getStocks);

stockRoutes.use(authenticate);

stockRoutes.get("/:stockId", getStock);

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
  [check("name").not().isEmpty(), check("categoryId").not().isEmpty()],
  updateStock
);

stockRoutes.patch(
  "/WImage/:stockId",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("categoryId").not().isEmpty()],
  updateStockWImage
);

stockRoutes.delete("/:placeId", deleteStock);
