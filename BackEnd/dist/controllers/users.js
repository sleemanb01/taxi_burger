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
exports.signup = exports.login = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const SECRET_KEY = process.env.JWT_KEY;
const internalError = () => {
    return new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
};
/* ************************************************************** */
const getUsers = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    try {
        users = yield user_model_1.default.find({}, "-password");
    }
    catch (_a) {
        return next(internalError());
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ users: users.map((user) => user.toObject({ getters: true })) });
});
exports.getUsers = getUsers;
/* ************************************************************** */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { email, password } = req.body;
    let targetUser;
    try {
        targetUser = yield user_model_1.default.findOne({ email: email });
    }
    catch (_b) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_CREDENTIALS, enums_1.HTTP_RESPONSE_STATUS.Forbidden);
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = yield bcryptjs_1.default.compare(password, targetUser.password);
    }
    catch (_c) {
        return next(internalError());
    }
    if (!isValidPassword) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_CREDENTIALS, enums_1.HTTP_RESPONSE_STATUS.Forbidden);
        return next(error);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: targetUser.id, email: targetUser.email }, SECRET_KEY, { expiresIn: "1h" });
    }
    catch (_d) {
        return next(internalError());
    }
    const ret = {
        id: targetUser.id,
        email: targetUser.email,
        token,
        isAdmin: targetUser.isAdmin,
    };
    res.json(ret);
});
exports.login = login;
/* ************************************************************** */
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, email, password } = req.body;
    const salt = 12;
    let alreadySigned;
    try {
        alreadySigned = yield user_model_1.default.findOne({ email: email });
    }
    catch (_f) {
        return next(new http_error_1.HttpError(messages_1.ERROR_SIGNUP, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (alreadySigned) {
        return next(new http_error_1.HttpError(messages_1.ERROR_EMAIL_EXIST, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    let hashedPassword;
    try {
        hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    }
    catch (_g) {
        return next(internalError());
    }
    let createdUser = new user_model_1.default({
        name,
        email,
        password: hashedPassword,
        image: (_e = req.file) === null || _e === void 0 ? void 0 : _e.path,
        isAdmin: false,
    });
    try {
        yield createdUser.save();
    }
    catch (_h) {
        return next(internalError());
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: createdUser.id, email: createdUser.email }, SECRET_KEY, { expiresIn: "1h" });
    }
    catch (_j) {
        return next(internalError());
    }
    const ret = {
        id: createdUser.id,
        email: createdUser.email,
        token,
        isAdmin: false,
    };
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json(ret);
});
exports.signup = signup;
