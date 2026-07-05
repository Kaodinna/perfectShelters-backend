import Joi from "joi";
import bcrypt from "bcryptjs";
import { AuthPayload } from "../interface/Auth.dto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { APP_SECRET } from "../config/db.config";

export const commentSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  emailAddress: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  comment: Joi.string().required(),
  drawingId: Joi.string().required(),
});

export const drawingSchema = Joi.object().keys({
  frontElevation: Joi.string().required(),
  rightElevation: Joi.string().required(),
  leftElevation: Joi.string().required(),
  type: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  refNo: Joi.string().required(),
  price: Joi.string().required(),
  drawing_details: Joi.array().items(
    Joi.object().keys({
      floor: Joi.string().required(),
      details: Joi.string().required(),
    })
  ),
});

export const ConstructionSchema = Joi.object().keys({
  coverPhoto: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  location: Joi.string().allow("").optional(),
  status: Joi.string().valid("Ongoing", "Completed").optional(),
  clientName: Joi.string().allow("").optional(),
  year: Joi.string().allow("").optional(),
  videos: Joi.array().items(Joi.string()).optional(),
});

export const pictureSchema = Joi.object().keys({
  picture: Joi.string().required(),
  details: Joi.string().required(),
  drawingId: Joi.string().required(),
});

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const Generatesignature = async (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET);
};

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  // NOTE: intentionally left without a leading `^` anchor (unlike registerSchema) —
  // tightening this could reject the password of an already-registered account
  // (e.g. an admin whose password has a special character or is 30+ chars),
  // locking them out at login. Revisit once existing account passwords are known-safe.
  password: Joi.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
});

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
