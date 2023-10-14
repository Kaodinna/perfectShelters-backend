import { Request, Response } from "express";
import { registerSchema,option,GenerateSalt,GeneratePassword,loginSchema,validatePassword } from "../utils/utility";
import User from "../model/userModel";
import {emailHtml,mailSent} from '../utils/notification';
import {userSubject,fromAdminMail} from '../config/db.config';
import { JWT_KEY } from "../config/db.config";
import jwt from "jsonwebtoken";

interface JwtPayload {
    email: string;
    _id: string; // Add other necessary fields
  }


/**========================REGISTER USER==========================**/

   
export const Register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      password,
    } = req.body;

    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = await User.create({
        email,
        password: userPassword,
        firstName,
        lastName,
        salt,
        address,
        phone,
      });

      const payload = {
        email: newUser.email, // Include other necessary fields
      };
      const secret = `${JWT_KEY}verifyThisaccount`; // Ensure that you have JWT_KEY set in your environment variables
      const signature = jwt.sign(payload, secret);

      if (newUser) {
        return res.status(200).json({
          status: 'Success',
          data: newUser, // Return the newly created user object
        });
      }
    } 
      return res.status(400).json({
        message: 'User already exists',
      });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

/**========================Verify USER==========================**/

export const verifyAccount = async (req: Request, res: Response) => {
  const { token } = req.params;
  const secretKey = `${JWT_KEY}verifyThisaccount`;

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (user) {
      user.accountStatus = true;
      const updatedUser = await user.save();

      if (updatedUser) {
        const url = `https://investement.vercel.app/user-login`;
        res.redirect(url)
        // Return a success message along with the URL
       
      } else {
        throw new Error("Account activation failed");
      }
    } else {
      throw new Error("No record found for the provided email");
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

  
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
        const token = jwt.sign(payload, secret);

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
