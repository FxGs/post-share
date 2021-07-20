const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.PostSchema = Joi.object({
  title: Joi.string().max(100).required().escapeHTML(),
  body: Joi.string().max(10000).required().escapeHTML(),
});

module.exports.CommentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().max(1000).required().escapeHTML(),
  }).required(),
});

module.exports.UserSchema = Joi.object({
  name: Joi.string().allow("").max(50).escapeHTML(),
  bio: Joi.string().allow("").max(10000).escapeHTML(),
});
