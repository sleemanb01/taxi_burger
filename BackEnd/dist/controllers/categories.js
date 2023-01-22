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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategories = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const category_model_1 = __importDefault(require("../models/category.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const internalError = () => {
    return new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
};
/* ************************************************************** */
const getCategories = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let categories = [];
    try {
        categories = yield category_model_1.default.find();
    }
    catch (_a) {
        return next(internalError());
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({
        categories: categories.map((i) => i.toObject({ getters: true })),
    });
});
exports.getCategories = getCategories;
/* ************************************************************** */
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name } = req.body;
    const creatorId = req.userData.userId;
    let targetUser;
    try {
        targetUser = yield user_model_1.default.findById(creatorId);
    }
    catch (_b) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser || !targetUser.isAdmin) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    const newCategory = new category_model_1.default({
        name,
    });
    let alreadySigned;
    try {
        alreadySigned = yield category_model_1.default.findOne({ name: name });
    }
    catch (_c) {
        return next(new http_error_1.HttpError(messages_1.ERROR_EXISTS, enums_1.HTTP_RESPONSE_STATUS.Bad_Request));
    }
    try {
        yield newCategory.save();
    }
    catch (_d) {
        return next(internalError());
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ category: newCategory });
});
exports.addCategory = addCategory;
/* ************************************************************** */
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name } = req.body;
    const CategoryId = req.params.CategoryId;
    let category;
    try {
        category = yield category_model_1.default.findById(CategoryId);
    }
    catch (_e) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!category_model_1.default) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    category = category;
    category.name = name;
    try {
        yield category.save();
    }
    catch (_f) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ category: category.toObject({ getters: true }) });
});
exports.updateCategory = updateCategory;
/* ************************************************************** */
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CategoryId = req.params.placeId;
    let targetCategory;
    try {
        targetCategory = yield category_model_1.default.findById(CategoryId);
    }
    catch (_g) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!targetCategory) {
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
        yield targetCategory.remove();
    }
    catch (_j) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ message: messages_1.DELETED });
});
exports.deleteCategory = deleteCategory;
