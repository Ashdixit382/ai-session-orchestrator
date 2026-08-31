import { AIProviderError } from "../provider/provider.error.js";
import { AppError } from "../utils/AppError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { errors: err.details }),
    });
  }

  if (err instanceof AIProviderError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      provider: err.provider,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
