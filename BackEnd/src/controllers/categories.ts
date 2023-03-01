import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import { HttpError } from "../models/http-error";
import Category, { ICategory } from "../models/category.model";
import User from "../models/user.model";
import { IUser } from "../models/user.model";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { RequestWUser, AuthorizationRequest } from "../types/types";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_INPUTS,
  ERROR_INVALID_DATA,
  ERROR_UNAUTHORIZED,
  DELETED,
  ERROR_EXISTS,
} from "../util/messages";

/* ************************************************************** */

const internalError = new HttpError(
  ERROR_INTERNAL_SERVER,
  HTTP_RESPONSE_STATUS.Internal_Server_Error
);

/* ************************************************************** */

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let categories = [];

  try {
    categories = await Category.find();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({
    categories: categories,
  });
};

/* ************************************************************** */

export const addCategory = async (
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

  const { name } = req.body;
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

  const newCategory = new Category({
    name,
  });

  let alreadySigned;

  try {
    alreadySigned = await Category.findOne({ name: name });
  } catch {
    return next(internalError);
  }

  if (alreadySigned) {
    return next(new HttpError(ERROR_EXISTS, HTTP_RESPONSE_STATUS.Bad_Request));
  }

  try {
    await newCategory.save();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.Created).json({ category: newCategory });
};

/* ************************************************************** */

export const updateCategory = async (
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

  const { name } = req.body;
  const CategoryId = req.params.CategoryId;
  let category: ICategory | null;

  try {
    category = await Category.findById(CategoryId);
  } catch {
    return next(internalError);
  }

  if (!Category) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  category = category as ICategory;

  category.name = name;

  try {
    await category.save();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ category: category });
};

/* ************************************************************** */

export const deleteCategory = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) => {
  const CategoryId = req.params.placeId;
  let targetCategory;

  try {
    targetCategory = await Category.findById(CategoryId);
  } catch {
    return next(internalError);
  }

  if (!targetCategory) {
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
    await targetCategory.remove();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ message: DELETED });
};
