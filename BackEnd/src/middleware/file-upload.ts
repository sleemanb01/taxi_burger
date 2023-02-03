import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import { MulterRequest } from "../types/types";

const MB = 1024 * 1024;
const FILE_LIMIT = 1.5 * MB;
// const PATH_IMAGES_UPLOAD = "uploads/images";
const ERROR_MESSAGE = "Invalid mime type!";
const ERROR_LIMIT_EXCEEDED = "File is too big!";

const MIME_TYPE_MAP = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpeg"],
  ["image/jpg", "jpg"],
]);

// type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// const destFunc = (
//   _req: MulterRequest,
//   _file: Express.Multer.File,
//   cb: DestinationCallback
// ) => {
//   cb(null, PATH_IMAGES_UPLOAD);
// };

const fileNameFunc = (
  _req: MulterRequest,
  file: Express.Multer.File,
  cb: FileNameCallback
) => {
  const ext = MIME_TYPE_MAP.get(file.mimetype);
  cb(null, uuidv4() + "." + ext);
};

const fileFilterFunc = (
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  let errorMessage: string | null = null;
  const size = parseInt(req.headers["content-length"]);
  const isValid = !!MIME_TYPE_MAP.get(file.mimetype);
  const isInLimit = size < FILE_LIMIT;

  if (!isInLimit) {
    errorMessage = ERROR_LIMIT_EXCEEDED;
  }
  if (!isValid) {
    errorMessage = ERROR_MESSAGE;
  }

  errorMessage ? cb(new Error(errorMessage)) : cb(null, isValid);
};

export const fileUpload = multer({
  limits: { fileSize: FILE_LIMIT },
  storage: multer.diskStorage({
    // destination: destFunc,
    filename: fileNameFunc,
  }),
  fileFilter: fileFilterFunc,
});
