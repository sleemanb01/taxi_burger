import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import { HttpError } from "../models/http-error";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { RequestWUser, AuthorizationRequest } from "../types/types";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_INPUTS,
  ERROR_INVALID_DATA,
  ERROR_UNAUTHORIZED,
  ERROR_EXISTS,
} from "../util/messages";

import Shift, { IShift } from "../models/shift.model";
import User, { IUser } from "../models/user.model";

/* ************************************************************** */

const internalError = new HttpError(
  ERROR_INTERNAL_SERVER,
  HTTP_RESPONSE_STATUS.Internal_Server_Error
);

/* ************************************************************** */

export const getShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const date = req.params.shiftDate;
  let shift: IShift | null;

  try {
    shift = await Shift.findOne({ date: date });
  } catch {
    return next(internalError);
  }

  if (!shift) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ shift: shift });
};

/* ************************************************************** */

export const getShifts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let shifts = [];

  try {
    shifts = await Shift.find();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({
    categories: shifts,
  });
};

/* ************************************************************** */

export const addShift = async (
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

  const { date, bread, meat } = req.body;
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

  let alreadyOpened: IShift | null;

  try {
    alreadyOpened = await Shift.findOne({ date: date });
  } catch {
    return next(internalError);
  }

  if (alreadyOpened) {
    return next(new HttpError(ERROR_EXISTS, HTTP_RESPONSE_STATUS.Bad_Request));
  }

  const newShift = new Shift({
    date,
    bread,
    meat,
    usages: [],
  });

  try {
    await newShift.save();
  } catch {
    return next(internalError);
  }

  res.status(HTTP_RESPONSE_STATUS.Created).json({ shift: newShift });
};

/* ************************************************************** */

export const updateShift = async (
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

  const { meat, bread } = req.body;
  const shiftId = req.params.CategoryId;
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

  shift = shift as IShift;

  shift.bread = bread;
  shift.meat = meat;

  try {
    await shift.save();
  } catch {
    return next(internalError);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ shift: shift.toObject({ getters: true }) });
};
