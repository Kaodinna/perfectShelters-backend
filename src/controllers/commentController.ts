import { Request, Response } from "express";
import { commentSchema, option } from "../utils/utility";
import User from "../model/userModel";
import Comment from "../model/comment.model";
import Drawing from "../model/drawingModel";
import mongoose, { Document } from "mongoose";

/**========================REGISTER USER==========================**/

export const AddComment = async (req: Request, res: Response) => {
  try {
    const { fullName, emailAddress, phoneNumber, comment, drawingId } =
      req.body;

    const validateResult = commentSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

    const newComment = await Comment.create({
      fullName,
      emailAddress,
      phoneNumber,
      comment,
    });
    const drawing = await Drawing.findById(drawingId);

    if (drawing) {
      drawing.comments.push(newComment._id);
      await drawing.save();
    }

    if (newComment) {
      return res.status(200).json({
        status: "Success",
        data: newComment, // Return the newly created user object
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
