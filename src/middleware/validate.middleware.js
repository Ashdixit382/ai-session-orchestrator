import { AppError } from "../utils/AppError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = result.error.flatten().fieldErrors;
      return next(new AppError("Invalid request data", 400, error));
    }

    req.body = result.data;

    next();
  };
};

export default validate;
