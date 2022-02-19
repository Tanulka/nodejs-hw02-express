const Joi = require('joi');
const user = require('../../models/user');
const createError = require('http-errors');

function verifyEmail(req, res, next) {
  const verifyEmailSchema = Joi.object({
    email: Joi.string().pattern(user.emailRegexp).required(),
  });
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
      return next(createError(400, error.message));
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = verifyEmail;
