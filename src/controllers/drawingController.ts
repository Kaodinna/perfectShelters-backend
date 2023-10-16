import { Request, Response } from "express";
import { drawingSchema, option } from "../utils/utility";
import Drawing from "../model/drawingModel";
import { JWT_KEY } from "../config/db.config";
import jwt from "jsonwebtoken";

export const AddDrawing = async (req: Request, res: Response) => {
  try {
    const {
      frontElevation,
      rightElevation,
      leftElevation,
      type,
      category,
      description,
      refNo,
      price,
      drawing_details,
    } = req.body;

    const validateResult = drawingSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

    const existingDrawing = await Drawing.findOne({ refNo });
    if (!existingDrawing) {
      const newDrawing = await Drawing.create({
        frontElevation,
        rightElevation,
        leftElevation,
        type,
        category,
        description,
        refNo,
        price,
        drawing_details,
      });

      const payload = {
        email: newDrawing.refNo, // Include other necessary fields
      };
      const secret = `${JWT_KEY}verifyThisaccount`; // Ensure that you have JWT_KEY set in your environment variables
      const signature = jwt.sign(payload, secret);

      if (newDrawing) {
        return res.status(200).json({
          status: "Success",
          data: newDrawing, // Return the newly created user object
        });
      }
    }
    return res.status(400).json({
      message: "Ref No already exists",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
