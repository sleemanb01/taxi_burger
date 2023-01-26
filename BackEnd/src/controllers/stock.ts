import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

import { HttpError } from "../models/http-error";
import Stock, { IStock } from "../models/stock.model";
import User from "../models/user.model";
import Category from "../models/category.model";
import { IUser } from "../models/user.model";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { RequestWUser, AuthorizationRequest } from "../types/types";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_INPUTS,
  ERROR_LOGIN,
  ERROR_INVALID_DATA,
  ERROR_DELETE,
  ERROR_UNAUTHORIZED,
  DELETED,
  ERROR_DELETE_FILE,
} from "../util/messages";
import { fileUpload } from "../middleware/file-upload";

/* ************************************************************** */

const internalError = () => {
  return new HttpError(
    ERROR_INTERNAL_SERVER,
    HTTP_RESPONSE_STATUS.Internal_Server_Error
  );
};

/* ************************************************************** */

export const getStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.stockId;
  let stock: IStock | null;

  try {
    stock = await Stock.findOne({ _id: id });
  } catch {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ stock: stock });
};

/* ************************************************************** */

export const getStocks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let stocks = [];
  let categories;

  try {
    stocks = await Stock.find();
    categories = await getCategories();
    if (!categories) {
      throw "";
    }
  } catch {
    return next(internalError());
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({
    stocks: stocks.map((stock) => stock.toObject({ getters: true })),
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};

/* ************************************************************** */

const getCategories = async () => {
  let categories = [];

  try {
    categories = await Category.find();
    return categories;
  } catch {
    return null;
  }
};

/* ************************************************************** */

export const addStock = async (
  req: RequestWUser,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ERROR_INVALID_INPUTS,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  const { name, quantity, categoryId, inUse } = req.body;
  const creatorId = req.userData.userId;
  let targetUser: IUser | null;

  try {
    targetUser = await User.findById(creatorId);
  } catch {
    return next(
      new HttpError(ERROR_LOGIN, HTTP_RESPONSE_STATUS.Internal_Server_Error)
    );
  }

  if (!targetUser || !targetUser.isAdmin) {
    const error = new HttpError(
      ERROR_UNAUTHORIZED,
      HTTP_RESPONSE_STATUS.Unauthorized
    );
    return next(error);
  }

  const newStock = new Stock({
    name,
    quantity,
    categoryId,
    inUse,
    image: req.file?.path || req.body.image,
  });

  try {
    await newStock.save();
  } catch {
    return next(internalError());
  }

  res.status(HTTP_RESPONSE_STATUS.Created).json({ stock: newStock });
};

/* ************************************************************** */

export const updateStockWImage = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ERROR_INVALID_INPUTS,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  const { name, categoryId } = req.body;
  const stockId = req.params.stockId;
  let stock: IStock | null;

  try {
    stock = await Stock.findById(stockId);
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!stock) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  stock.name = name;
  stock.categoryId = categoryId;

  if (req.file) {
    fs.unlink(stock.image, () => {
      console.log(ERROR_DELETE_FILE);
    });
  }
  stock.image = req.file?.path;

  try {
    await stock.save();
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ stock: stock.toObject({ getters: true }) });
};

export const updateStock = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ERROR_INVALID_INPUTS,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  const { name, categoryId } = req.body;
  const stockId = req.params.stockId;
  let stock: IStock | null;

  try {
    stock = await Stock.findById(stockId);
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!stock) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  stock.name = name;
  stock.categoryId = categoryId;

  try {
    await stock.save();
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ stock: stock.toObject({ getters: true }) });
};

/* ************************************************************** */

export const deleteStock = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) => {
  const stockId = req.params.placeId;
  let targetStock;

  try {
    targetStock = await Stock.findById(stockId);
  } catch {
    const error = new HttpError(
      ERROR_DELETE,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!targetStock) {
    const error = new HttpError(
      ERROR_UNAUTHORIZED,
      HTTP_RESPONSE_STATUS.Not_Found
    );
    return next(error);
  }

  const creatorId = req.userData.userId;
  let targetUser: IUser | null;

  try {
    targetUser = await User.findById(creatorId);
  } catch {
    return next(
      new HttpError(ERROR_LOGIN, HTTP_RESPONSE_STATUS.Internal_Server_Error)
    );
  }

  if (!targetUser || !targetUser.isAdmin) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Unauthorized
    );
    return next(error);
  }

  try {
    await targetStock.remove();
  } catch {
    const error = new HttpError(
      ERROR_DELETE,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(ERROR_DELETE_FILE);
    });
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ message: DELETED });
};
