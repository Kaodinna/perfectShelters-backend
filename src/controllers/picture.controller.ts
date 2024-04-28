import { Request, Response } from "express";
import { pictureSchema, option } from "../utils/utility";
import Pictures from "../model/pictures.model";
import Construction from "../model/construction.model";

export const AddPicture = async (req: Request, res: Response) => {
  try {
    const { picture, details, drawingId } = req.body;

    const validateResult = pictureSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

    const newPicture = await Pictures.create({
      picture,
      details,
      drawingId,
    });
    const drawing = await Construction.findById(drawingId);
    if (!drawing) {
      return res.status(400).json({
        stamessagetus: "Construction not found",
      });
    }
    if (drawing) {
      drawing.pictures.push(newPicture._id);
      await drawing.save();
    }

    if (newPicture) {
      return res.status(200).json({
        status: "Success",
        data: newPicture, // Return the newly created user object
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
