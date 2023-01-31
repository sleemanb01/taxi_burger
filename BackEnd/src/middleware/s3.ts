import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import fs from "fs";
import { S3ReturnType, S3UResult } from "../types/types";
import { ERROR_UPLOAD_FILE } from "../util/messages";

const ENV = process.env;
const bucketName = ENV.AWS_BUCKET;
const region = ENV.AWS_BUCKET_REGION;
const accessKeyId = ENV.AWS_ACCESS_KEY;
const secretAccessKey = ENV.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const uploadToS3 = async (
  fileData?: Express.Multer.File
): Promise<S3ReturnType> => {
  try {
    const fileContent = fs.readFileSync(fileData!.path);

    const params: PutObjectRequest = {
      Bucket: bucketName!,
      Key: fileData!.originalname,
      Body: fileContent,
    };

    const res: S3UResult = await s3.upload(params).promise();

    const ret = { success: true, message: "", data: res.Key };

    return ret;
  } catch (e) {
    const ret = {
      success: false,
      message: ERROR_UPLOAD_FILE,
      data: undefined,
    };

    return ret;
  }
};

export const getFileS3 = async (fileKey: string) => {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName!,
    };

    const downloadUrl = await s3.getSignedUrlPromise(
      "getObject",
      downloadParams
    );
    return downloadUrl;
  } catch (e) {
    throw new Error(ERROR_UPLOAD_FILE);
  }
};

export const deleteFileS3 = async (filePath: string) => {
  try {
    const params = {
      Key: filePath,
      Bucket: bucketName!,
    };

    const res = await s3.deleteObject(params).promise();
    return !!res.$response.error;
  } catch (e) {
    throw new Error(ERROR_UPLOAD_FILE);
  }
};
