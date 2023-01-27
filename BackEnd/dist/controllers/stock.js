"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStock = exports.updateStock = exports.updateStockPartial = exports.updateStockWImage = exports.addStock = exports.getStocks = exports.getStock = void 0;
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../models/http-error");
const stock_model_1 = __importDefault(require("../models/stock.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const internalError = () => {
    return new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
};
/* ************************************************************** */
const getStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.stockId;
    let stock;
    try {
        stock = yield stock_model_1.default.findOne({ _id: id });
    }
    catch (_a) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ stock: stock });
});
exports.getStock = getStock;
/* ************************************************************** */
const getStocks = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let stocks = [];
    let categories;
    try {
        stocks = yield stock_model_1.default.find();
        categories = yield getCategories();
        if (!categories) {
            throw "";
        }
    }
    catch (_b) {
        return next(internalError());
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({
        stocks: stocks.map((stock) => stock.toObject({ getters: true })),
        categories: categories.map((category) => category.toObject({ getters: true })),
    });
});
exports.getStocks = getStocks;
/* ************************************************************** */
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    let categories = [];
    try {
        categories = yield category_model_1.default.find();
        return categories;
    }
    catch (_c) {
        return null;
    }
});
/* ************************************************************** */
const addStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, quantity, categoryId, inUse } = req.body;
    const creatorId = req.userData.userId;
    let targetUser;
    try {
        targetUser = yield user_model_1.default.findById(creatorId);
    }
    catch (_e) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser || !targetUser.isAdmin) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    const newStock = new stock_model_1.default({
        name,
        quantity,
        categoryId,
        inUse,
        image: ((_d = req.file) === null || _d === void 0 ? void 0 : _d.path) || req.body.image,
    });
    try {
        yield newStock.save();
    }
    catch (_f) {
        return next(internalError());
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ stock: newStock });
});
exports.addStock = addStock;
/* ************************************************************** */
const updateStockWImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, categoryId } = req.body;
    const stockId = req.params.stockId;
    let stock;
    try {
        stock = yield stock_model_1.default.findById(stockId);
    }
    catch (_h) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!stock) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    stock.name = name;
    stock.categoryId = categoryId;
    if (req.file) {
        fs_1.default.unlink(stock.image, () => {
            console.log(messages_1.ERROR_DELETE_FILE);
        });
    }
    stock.image = (_g = req.file) === null || _g === void 0 ? void 0 : _g.path;
    try {
        yield stock.save();
    }
    catch (_j) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ stock: stock.toObject({ getters: true }) });
});
exports.updateStockWImage = updateStockWImage;
/* ************************************************************** */
const updateStockPartial = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { quantity, inUse } = req.body;
    const stockId = req.params.stockId;
    let stock;
    try {
        stock = yield stock_model_1.default.findById(stockId);
    }
    catch (_k) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!stock) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    stock.quantity = quantity;
    stock.inUse = inUse;
    try {
        yield stock.save();
    }
    catch (_l) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ stock: stock.toObject({ getters: true }) });
});
exports.updateStockPartial = updateStockPartial;
/* ************************************************************** */
const updateStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, categoryId } = req.body;
    const stockId = req.params.stockId;
    let stock;
    try {
        stock = yield stock_model_1.default.findById(stockId);
    }
    catch (_m) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!stock) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    stock.name = name;
    stock.categoryId = categoryId;
    try {
        yield stock.save();
    }
    catch (_o) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ stock: stock.toObject({ getters: true }) });
});
exports.updateStock = updateStock;
/* ************************************************************** */
const deleteStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stockId = req.params.placeId;
    let targetStock;
    try {
        targetStock = yield stock_model_1.default.findById(stockId);
    }
    catch (_p) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!targetStock) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    const creatorId = req.userData.userId;
    let targetUser;
    try {
        targetUser = yield user_model_1.default.findById(creatorId);
    }
    catch (_q) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser || !targetUser.isAdmin) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    try {
        yield targetStock.remove();
    }
    catch (_r) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (req.file) {
        fs_1.default.unlink(req.file.path, () => {
            console.log(messages_1.ERROR_DELETE_FILE);
        });
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ message: messages_1.DELETED });
});
exports.deleteStock = deleteStock;
