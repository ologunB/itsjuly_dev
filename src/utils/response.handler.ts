// your-project-name/src/utils/responseHandler.ts

import { Response } from "express";
import { StatusCodes } from "http-status-codes";
export interface BasicResponse<T> {
  message: string;
  data?: T;
  error?: string;
}
export interface IResponse<T, D> extends Omit<BasicResponse<T>, "error"> {
  res: Response;
  status?: number;
  meta?: D;
}
export function successResponse<T, D>(prop: IResponse<T, D>) {
  if (!prop.status) prop.status = StatusCodes.OK;
  return prop.res.status(prop.status).json({
    success: true,
    message: prop.message,
    data: prop.data,
    meta: prop.meta,
  });
}

export const errorResponse = ({
  res,
  message,
  status,
}: {
  res: Response;
  message: string;
  status?: number;
}) => {
  if (!status) status = StatusCodes.BAD_REQUEST;
  return res.status(status).json({
    success: false,
    message,
  });
};
