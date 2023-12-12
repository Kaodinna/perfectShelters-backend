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
    const drawing = await Drawing.findById(drawingId).populate("comments");

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

export const deleteDrawing = async (req: Request, res: Response) => {
  console.log("boyyy", req.params);
  try {
    const drawingId = req.params.id;

    // Check if the product exists
    const productToDelete = await Drawing.findById(drawingId);
    if (!productToDelete) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete the product
    await Drawing.findByIdAndDelete(drawingId);
    return res.status(200).json({
      status: "Success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const editDrawing = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const { type, category, description, price, refNo, drawing_details } =
      req.body;

    // Find the product by ID
    const drawing = await Drawing.findById(productId).exec();

    // Check if the product exists
    if (!drawing) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update the product fields
    drawing.type = type;
    drawing.category = category;
    drawing.description = description;
    drawing.price = price;
    drawing.refNo = refNo;
    drawing.drawing_details = drawing_details;

    // Save the updated product
    const updatedProduct = await drawing.save();

    // Respond with the updated product data
    return res.status(200).json({
      status: "Success",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
