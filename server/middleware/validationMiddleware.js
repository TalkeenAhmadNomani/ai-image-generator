import Joi from "joi";

// Schema for user signup
const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

// Schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schema for creating a post
const postSchema = Joi.object({
  name: Joi.string().required(),
  prompt: Joi.string().required(),
  photo: Joi.string().required(),
});

// Middleware function to perform validation
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // If validation fails, send a 400 Bad Request response
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export { validate, signupSchema, loginSchema, postSchema };
