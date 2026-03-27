const HttpError = require("../utils/httpError");

function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(
        new HttpError(
          400,
          "Validation failed.",
          error.details.map((detail) => detail.message)
        )
      );
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
