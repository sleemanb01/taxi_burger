import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import { HttpError } from "../models/http-error";
import Stock from "../models/stock.model";
import User from "../models/user.model";
import Assignment, { IAssignment } from "../models/assignment.model";
import { IUser } from "../models/user.model";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { RequestWUser, AuthorizationRequest } from "../types/types";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_INPUTS,
  ERROR_INVALID_DATA,
  ERROR_UNAUTHORIZED,
  DELETED,
} from "../util/messages";
import { deleteFileS3, getFileS3, uploadToS3 } from "../middleware/s3";

/* ************************************************************** */

const internalError = new HttpError(
  ERROR_INTERNAL_SERVER,
  HTTP_RESPONSE_STATUS.Internal_Server_Error
);

/* ************************************************************** */

export const getAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.assignmentId;
  let assignment: IAssignment | null;

  try {
    assignment = await Assignment.findOne({ _id: id });
  } catch {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  if (!assignment) {
    return next(internalError);
  }

  if (assignment.image) {
    assignment.image = await getFileS3(assignment.image);
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ assignment: assignment });
};

/* ************************************************************** */

export const getAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let assignments: IAssignment[] = [];

  try {
    assignments = await Stock.find();
  } catch {
    return next(internalError);
  }

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].image) {
      assignments[i].image = await getFileS3(assignments[i].image!);
    }
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({
    assignments: assignments.map((a) => a.toObject({ getters: true })),
  });
};

/* ************************************************************** */

export const addAssignment = async (
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

  const { name, description } = req.body;
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

  const newAssignment = new Assignment({
    name,
    description,
    image: upload.data || req.body.image,
  });

  try {
    await newAssignment.save();
  } catch {
    return next(internalError);
  }

  res
    .status(HTTP_RESPONSE_STATUS.Created)
    .json({ stock: newAssignment.toObject({ getters: true }) });
};

/* ************************************************************** */

export const updateAssignment = async (
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

  const { name, description } = req.body;
  const assignmentId = req.params.assignmentId;
  let assignment: IAssignment | null;

  try {
    assignment = await Stock.findById(assignmentId);
  } catch {
    return next(internalError);
  }

  if (!assignment) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  assignment.name = name;
  assignment.description = description;

  try {
    await assignment.save();
  } catch {
    return next(internalError);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ assignment: assignment.toObject({ getters: true }) });
};

/* ************************************************************** */

export const deleteAssignment = async (
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) => {
  const assignemntId = req.params.assignemntId;
  let targetAssignment;

  try {
    targetAssignment = await Stock.findById(assignemntId);
  } catch {
    return next(internalError);
  }

  if (!targetAssignment) {
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
    await targetAssignment.remove();
  } catch {
    return next(internalError);
  }

  if (req.file) {
    const resError = await deleteFileS3(targetAssignment.image);
    if (resError) {
      return next(internalError);
    }
  }

  res.status(HTTP_RESPONSE_STATUS.OK).json({ message: DELETED });
};
