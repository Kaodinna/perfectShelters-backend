"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editDrawing = exports.deleteDrawing = exports.getDrawingsByType = exports.getDrawingsByParams = exports.getDrawingById = exports.getAllDrawings = exports.AddDrawing = void 0;
const utility_1 = require("../utils/utility");
const drawingModel_1 = __importDefault(require("../model/drawingModel"));
const AddDrawing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { frontElevation, rightElevation, leftElevation, type, category, description, refNo, price, drawing_details, } = req.body;
        const validateResult = utility_1.drawingSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }
        const existingDrawing = yield drawingModel_1.default.findOne({ refNo });
        if (!existingDrawing) {
            const newDrawing = yield drawingModel_1.default.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.AddDrawing = AddDrawing;
const getAllDrawings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use the `Drawing` model to find all drawings
        const drawings = yield drawingModel_1.default.find().populate("comments");
        if (drawings) {
            return res.status(200).json({
                status: "Success",
                data: drawings,
            });
        }
        return res.status(404).json({
            message: "No drawings found",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getAllDrawings = getAllDrawings;
const getDrawingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const drawingId = req.params.id; // Extract the drawing ID from the request parameters
    try {
        // Use the `Drawing` model to find the drawing by its ID
        const drawing = yield drawingModel_1.default.findById(drawingId).populate("comments");
        if (!drawing) {
            return res.status(404).json({
                message: "Drawing not found",
            });
        }
        return res.status(200).json({
            status: "Success",
            data: drawing,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getDrawingById = getDrawingById;
const getDrawingsByParams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type; // Cast type to string
        const category = req.query.category; // Cast category to string
        const query = {};
        if (type) {
            query.type = type;
        }
        if (category) {
            query.category = category;
        }
        const drawings = yield drawingModel_1.default.find(query);
        if (drawings.length > 0) {
            return res.status(200).json({
                status: "Success",
                data: drawings,
            });
        }
        else {
            return res.status(404).json({
                message: "No drawings found for the provided search parameters.",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getDrawingsByParams = getDrawingsByParams;
const getDrawingsByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = "bungalow"; // Define the type you want to filter by
        // Use Mongoose to find all drawings with the specified type
        const drawings = yield drawingModel_1.default.find({ type });
        if (drawings.length > 0) {
            return res.status(200).json({
                status: "Success",
                data: drawings,
            });
        }
        else {
            return res.status(404).json({
                message: "No drawings with the specified type found.",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getDrawingsByType = getDrawingsByType;
const deleteDrawing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("boyyy", req.params);
    try {
        const drawingId = req.params.id;
        // Check if the product exists
        const productToDelete = yield drawingModel_1.default.findById(drawingId);
        if (!productToDelete) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        // Delete the product
        yield drawingModel_1.default.findByIdAndDelete(drawingId);
        return res.status(200).json({
            status: "Success",
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.deleteDrawing = deleteDrawing;
const editDrawing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const { type, category, description, price, refNo, drawing_details } = req.body;
        // Find the product by ID
        const drawing = yield drawingModel_1.default.findById(productId).exec();
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
        const updatedProduct = yield drawing.save();
        // Respond with the updated product data
        return res.status(200).json({
            status: "Success",
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.editDrawing = editDrawing;
