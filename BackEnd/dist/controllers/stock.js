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
exports.deleteStock = exports.updateStock = exports.addStock = exports.getStock = void 0;
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../models/http-error");
const stock_model_1 = __importDefault(require("../models/stock.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const internalError = () => {
    return new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
};
/* ************************************************************** */
const getStock = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let stocks = [];
    try {
        stocks = yield stock_model_1.default.find();
    }
    catch (_a) {
        return next(internalError());
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ stocks: stocks.map((stock) => stock.toObject({ getters: true })) });
});
exports.getStock = getStock;
/* ************************************************************** */
const addStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, quantity } = req.body;
    const creatorId = req.userData.userId;
    let targetUser;
    try {
        targetUser = yield user_model_1.default.findById(creatorId);
    }
    catch (_c) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser || !targetUser.isAdmin) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    const newStock = new stock_model_1.default({
        name,
        quantity,
        image: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
    });
    try {
        yield newStock.save();
    }
    catch (_d) {
        return next(internalError());
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ stock: newStock });
});
exports.addStock = addStock;
/* ************************************************************** */
const updateStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { quantity } = req.body;
    const stockId = req.params.placeId;
    let stock;
    try {
        stock = yield stock_model_1.default.findById(stockId);
    }
    catch (_e) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!stock) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    stock.quantity = quantity;
    try {
        yield stock.save();
    }
    catch (_f) {
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
    catch (_g) {
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
    catch (_h) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser || !targetUser.isAdmin) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    try {
        yield targetStock.remove();
    }
    catch (_j) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    fs_1.default.unlink(targetStock.image, (err) => {
        console.log(err.message);
    });
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ message: messages_1.DELETED });
});
exports.deleteStock = deleteStock;
