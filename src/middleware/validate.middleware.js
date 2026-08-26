import { AppError } from "../utils/AppError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();

      return next(
        new AppError("Validation failed", 400, {
          fields: fieldErrors,
          form: formErrors,
        }),
      );
    }

    req.body = result.data;

    next();
  };
};

export default validate;
