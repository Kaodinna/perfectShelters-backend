import { Request, Response } from "express";
import { ConstructionSchema, option } from "../utils/utility";
import Construction from "../model/construction.model";
import Pictures from "../model/pictures.model";
export const AddConstruction = async (req: Request, res: Response) => {
  try {
    const { coverPhoto, title } = req.body;

    const validateResult = ConstructionSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        error: validateResult.error.details[0].message,
      });
    }

    const newConstruction = await Construction.create({
      coverPhoto,
      title,
    });

    if (newConstruction) {
      return res.status(200).json({
        status: "Success",
        data: newConstruction, // Return the newly created user object
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllConstructions = async (req: Request, res: Response) => {
  try {
    // Use the `Drawing` model to find all drawings
    const constructions = await Construction.find();

    if (constructions) {
      return res.status(200).json({
        status: "Success",
        data: constructions,
      });
    }

    return res.status(404).json({
      message: "No constructions found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteConstruct = async (req: Request, res: Response) => {
  try {
    const drawingId = req.params.id;

    // Check if the product exists
    const productToDelete = await Construction.findById(drawingId);
    if (!productToDelete) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Delete the product
    // Delete pictures associated with the construction
    await Pictures.deleteMany({ drawingId });
    await Construction.findByIdAndDelete(drawingId);
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

export const getConstructById = async (req: Request, res: Response) => {
  const drawingId = req.params.id; // Extract the drawing ID from the request parameters

  try {
    // Use the `Drawing` model to find the drawing by its ID
    const drawing = await Construction.findById(drawingId).populate("pictures");

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
