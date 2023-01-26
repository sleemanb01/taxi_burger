"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const file_upload_1 = require("../middleware/file-upload");
const auth_1 = require("../middleware/auth");
const stock_1 = require("../controllers/stock");
/* ************************************************************** */
exports.stockRoutes = express_1.default.Router();
exports.stockRoutes.get("/", stock_1.getStocks);
exports.stockRoutes.use(auth_1.authenticate);
exports.stockRoutes.get("/:stockId", stock_1.getStock);
exports.stockRoutes.post("/", file_upload_1.fileUpload.single("image"), [
    (0, express_validator_1.check)("name").not().isEmpty(),
    (0, express_validator_1.check)("quantity").isNumeric().isLength({ min: 0, max: 100 }),
], stock_1.addStock);
exports.stockRoutes.patch("/:stockId", [(0, express_validator_1.check)("name").not().isEmpty(), (0, express_validator_1.check)("categoryId").not().isEmpty()], stock_1.updateStock);
exports.stockRoutes.patch("/WImage/:stockId", file_upload_1.fileUpload.single("image"), [(0, express_validator_1.check)("name").not().isEmpty(), (0, express_validator_1.check)("categoryId").not().isEmpty()], stock_1.updateStockWImage);
exports.stockRoutes.delete("/:placeId", stock_1.deleteStock);
