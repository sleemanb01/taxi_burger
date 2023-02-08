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
  updateStockPartial,
} from "../controllers/stock";

/* ************************************************************** */

export const stockRoutes = express.Router();

const MAX = 50;

stockRoutes.get("/:date", getStocks);

stockRoutes.use(authenticate);

stockRoutes.get("/:stockId", getStock);

stockRoutes.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("quantity").isInt({ min: 0, max: MAX }),
  ],
  addStock
);

stockRoutes.patch(
  "/partial/:stockId/:shiftId",
  [
    check("quantity").isInt({ min: 0, max: MAX }),
    check("minQuantity").isInt({ min: 0, max: MAX }),
    check("inUse").isBoolean(),
  ],
  updateStockPartial
);

stockRoutes.patch(
  "/WImage/:stockId",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("categoryId").not().isEmpty()],
  updateStockWImage
);

stockRoutes.patch(
  "/:stockId",
  [check("name").not().isEmpty(), check("categoryId").not().isEmpty()],
  updateStock
);

stockRoutes.delete("/:placeId", deleteStock);
