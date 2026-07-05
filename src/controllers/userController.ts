import { Request, Response } from "express";
import { loginSchema,option,validatePassword } from "../utils/utility";
import User from "../model/userModel";
import { JWT_KEY } from "../config/db.config";
import jwt from "jsonwebtoken";

/**========================LOGIN USER==========================**/


export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (!user.accountStatus) {
        return res.status(403).json({
          message: "Your account is not activated Please check your email for verification Link",
        });
      }

      const validation = await validatePassword(
        password,
        user.password,
        user.salt
      );

      if (validation) {
        // Generate a JWT token
        const payload = {
          email: user.email,
          _id: user._id, // Include other necessary fields
        };
        const secret = `${JWT_KEY}verifyThisaccount`;
        const token = jwt.sign(payload, secret, { expiresIn: "7d" });

        // Return user details and token
        return res.status(200).json({
          message: "You have successfully logged in",
          user: {
            _id: user._id,
            email: user.email,
            // Include other user details here
          },
          token,
        });
      }
    }

    return res.status(400).json({
      message: "Wrong username or password",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
