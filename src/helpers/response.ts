import { Response } from "../interface/ExpressTypes";

export function sendResponse(
  res: Response,
  status = 200,
  success = true,
  message = "" || {},
  data: any = {},
  pagination: any = {}
) {
  type Response = {
    status: Number;
    success: Boolean;
    message: String | Object;
    data: any;
    pagination?: { currentPage: Number; totalPages: Number };
  };
  const response: Response = {
    status,
    success,
    message,
    pagination,
    data,
  };

  return res.status(status).json(response);
}
