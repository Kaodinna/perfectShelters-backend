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
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { refNo: { $regex: search, $options: "i" } },
      ];
    }

    const [drawings, total] = await Promise.all([
      Drawing.find(query).skip(skip).limit(limit),
      Drawing.countDocuments(query),
    ]);

    return res.status(200).json({
      status: "Success",
      data: drawings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
    const type = req.params.type || req.query.type as string;

    if (!type) {
      return res.status(400).json({ message: "Type parameter is required" });
    }

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
    const productId = req.params.id;
    const {
      description,
      price,
      type,
      category,
      refNo,
      frontElevation,
      rightElevation,
      leftElevation,
    } = req.body;

    const drawing = await Drawing.findById(productId).exec();

    if (!drawing) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (description !== undefined) drawing.description = description;
    if (price !== undefined) drawing.price = price;
    if (type !== undefined) drawing.type = type;
    if (category !== undefined) drawing.category = category;
    if (refNo !== undefined) drawing.refNo = refNo;
    if (frontElevation !== undefined) drawing.frontElevation = frontElevation;
    if (rightElevation !== undefined) drawing.rightElevation = rightElevation;
    if (leftElevation !== undefined) drawing.leftElevation = leftElevation;

    const updatedProduct = await drawing.save();
    return res.status(200).json({
      status: "Success",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
