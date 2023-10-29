import { Request, Response } from "express";
import { drawingSchema, option } from "../utils/utility";
import Drawing from "../model/drawingModel";

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

export const getAllDrawings = async (req: Request, res: Response) => {
  try {
    // Use the `Drawing` model to find all drawings
    const drawings = await Drawing.find().populate("comments");

    if (drawings) {
      return res.status(200).json({
        status: "Success",
        data: drawings,
      });
    }

    return res.status(404).json({
      message: "No drawings found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getDrawingById = async (req: Request, res: Response) => {
  const drawingId = req.params.id; // Extract the drawing ID from the request parameters

  try {
    // Use the `Drawing` model to find the drawing by its ID
    const drawing = await Drawing.findById(drawingId);

    if (!drawing) {
      return res.status(404).json({
        message: "Drawing not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: drawing,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
interface Query {
  type?: string;
  category?: string;
}

export const getDrawingsByParams = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string; // Cast type to string
    const category = req.query.category as string; // Cast category to string

    const query: Query = {};

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    const drawings = await Drawing.find(query);

    if (drawings.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: drawings,
      });
    } else {
      return res.status(404).json({
        message: "No drawings found for the provided search parameters.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getDrawingsByType = async (req: Request, res: Response) => {
  try {
    const type = "bungalow"; // Define the type you want to filter by

    // Use Mongoose to find all drawings with the specified type
    const drawings = await Drawing.find({ type });

    if (drawings.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: drawings,
      });
    } else {
      return res.status(404).json({
        message: "No drawings with the specified type found.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
