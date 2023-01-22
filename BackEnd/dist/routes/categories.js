"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const categories_1 = require("../controllers/categories");
const auth_1 = require("../middleware/auth");
/* ************************************************************** */
exports.categoriesRoutes = express_1.default.Router();
exports.categoriesRoutes.get("/", categories_1.getCategories);
exports.categoriesRoutes.use(auth_1.authenticate);
exports.categoriesRoutes.post("/", [(0, express_validator_1.check)("name").not().isEmpty()], categories_1.addCategory);
exports.categoriesRoutes.patch("/:categoryId", [(0, express_validator_1.check)("name").not().isEmpty()], categories_1.updateCategory);
exports.categoriesRoutes.delete("/:categoryId", categories_1.deleteCategory);
