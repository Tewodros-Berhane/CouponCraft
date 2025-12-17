export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.details.map((d) => ({ message: d.message, path: d.path })),
      });
    }
    req[property] = value;
    return next();
  };
