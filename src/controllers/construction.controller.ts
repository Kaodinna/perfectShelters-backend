import { Request, Response } from "express";
import { ConstructionSchema, option } from "../utils/utility";
import Construction from "../model/construction.model";
import Pictures from "../model/pictures.model";

export const AddConstruction = async (req: Request, res: Response) => {
  try {
    const validateResult = ConstructionSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({ error: validateResult.error.details[0].message });
    }

    const { coverPhoto, title, description, location, status, clientName, year, videos } = req.body;

    const newConstruction = await Construction.create({
      coverPhoto, title,
      description: description || "",
      location: location || "",
      status: status || "Ongoing",
      clientName: clientName || "",
      year: year || "",
      videos: videos || [],
    });

    return res.status(200).json({ status: "Success", data: newConstruction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateConstruction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, location, status, clientName, year, videos } = req.body;

    const updated = await Construction.findByIdAndUpdate(
      id,
      { $set: { title, description, location, status, clientName, year, videos } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Construction not found" });

    return res.status(200).json({ status: "Success", data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllConstructions = async (req: Request, res: Response) => {
  try {
    const constructions = await Construction.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: "Success", data: constructions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteConstruct = async (req: Request, res: Response) => {
  try {
    const drawingId = req.params.id;
    const productToDelete = await Construction.findById(drawingId);
    if (!productToDelete) return res.status(404).json({ message: "Product not found" });
    await Pictures.deleteMany({ drawingId });
    await Construction.findByIdAndDelete(drawingId);
    return res.status(200).json({ status: "Success", message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getConstructById = async (req: Request, res: Response) => {
  const drawingId = req.params.id;
  try {
    const drawing = await Construction.findById(drawingId).populate("pictures");
    if (!drawing) return res.status(404).json({ message: "Drawing not found" });
    return res.status(200).json({ status: "Success", data: drawing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
