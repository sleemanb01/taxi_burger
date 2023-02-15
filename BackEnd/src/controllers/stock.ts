import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

import { HttpError } from "../models/http-error";
import Stock, { IStock } from "../models/stock.model";
import User from "../models/user.model";
import Shift, { IShift, IUsage } from "../models/shift.model";
import Category from "../models/category.model";
import { IUser } from "../models/user.model";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { RequestWUser, AuthorizationRequest } from "../types/types";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_INPUTS,
  ERROR_INVALID_DATA,
  ERROR_UNAUTHORIZED,
  DELETED,
  ERROR_DELETE_FILE,
} from "../util/messages";
import { deleteFileS3, getFileS3, uploadToS3 } from "../middleware/s3";
import mongoose from "mongoose";

/* ************************************************************** */

const internalError = new HttpError(
  ERROR_INTERNAL_SERVER,
  HTTP_RESPONSE_STATUS.Internal_Server_Error
);

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

  if (!stock) {
    return next(internalError);
  }

  stock.image = await getFileS3(stock.image);

  res.status(HTTP_RESPONSE_STATUS.OK).json({ stock: stock });
};

/* ************************************************************** */

export const getStocks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let stocks: IStock[] = [];
  let categories;
  let shift;

  const date = req.params.date;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    stocks = await Stock.find();
    categories = await Category.find();
    shift = await Shift.findOne({ date: date });
    sess.commitTransaction();
  } catch {
    return next(internalError);
  }

  for (let i = 0; i < stocks.length; i++) {
    stocks[i].image = await getFileS3(stocks[i].image);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({
    stocks: stocks.map((stock) => stock.toObject({ getters: true })),
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
    shift: shift,
  });
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

  const { name, quantity, categoryId, minQuantity } = req.body;
  const creatorId = req.userData.userId;
  let targetUser: IUser | null;

  try {
    targetUser = await User.findById(creatorId);
  } catch {
    return next(internalError);
  }

  if (!targetUser) {
    const error = new HttpError(
      ERROR_UNAUTHORIZED,
      HTTP_RESPONSE_STATUS.Unauthorized
    );
    return next(error);
  }

  const upload = await uploadToS3(req.file);
  if (!upload.success) {
    return next(internalError);
  }

  const newStock = new Stock({
    name,
    quantity,
    categoryId,
    image: upload.data || req.body.image,
    minQuantity,
  });

  try {
    await newStock.save();
  } catch {
    return next(internalError);
  }

  res
    .status(HTTP_RESPONSE_STATUS.Created)
    .json({ stock: newStock.toObject({ getters: true }) });
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
    return next(internalError);
  }

  if (!stock) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  stock.name = name;
  stock.categoryId = categoryId;

  if (req.file) {
    const resError = await deleteFileS3(stock.image);
    if (resError) {
      return next(internalError);
    }
  }

  const upload = await uploadToS3(req.file);
  if (!upload.success && upload.data) {
    return next(internalError);
  }
  stock.image = upload.data!;

  try {
    await stock.save();
  } catch {
    return next(internalError);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ stock: stock.toObject({ getters: true }) });
};

/* ************************************************************** */

export const updateStockPartial = async (
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

  const { quantity, minQuantity } = req.body;
  const stockId = req.params.stockId;
  const shiftId = req.params.shiftId;
  let stock: IStock | null;
  let calcUsage = 0;
  let isAdd = false;

  try {
    stock = await Stock.findById(stockId);
  } catch {
    return next(internalError);
  }

  if (!stock) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  isAdd = quantity > stock?.quantity;

  calcUsage = stock.quantity - quantity;

  stock.quantity = quantity;
  stock.minQuantity = minQuantity;

  if (isAdd || shiftId === "undefined") {
    try {
      await stock.save();
    } catch {
      return next(internalError);
    }
  } else {
    let shift: IShift | null;

    try {
      shift = await Shift.findById(shiftId);
    } catch {
      return next(internalError);
    }

    if (!shift) {
      return next(
        new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
      );
    }

    const dataArr = shift.usages;
    const found: IUsage | undefined = dataArr.find((el) =>
      el.stockId?.equals(stock!._id!)
    );
    if (found) {
      found.quantity += calcUsage;
    } else {
      const usage: IUsage = { stockId: stockId, quantity: calcUsage };
      dataArr.push(usage);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await stock.save({ session: sess });
      await shift.save({ session: sess });
      sess.commitTransaction();
    } catch {
      return next(internalError);
    }
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ stock: stock.toObject({ getters: true }) });
};

/* ************************************************************** */

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
    return next(internalError);
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
    return next(internalError);
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
    return next(internalError);
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
    return next(internalError);
  }

  if (!targetUser || !(targetUser.email === process.env.MANAGER)) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Unauthorized
    );
    return next(error);
  }

  try {
    await targetStock.remove();
  } catch {
    return next(internalError);
  }

  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(ERROR_DELETE_FILE);
    });
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ message: DELETED });
};
