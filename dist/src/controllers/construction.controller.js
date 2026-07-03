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
exports.getConstructById = exports.deleteConstruct = exports.getAllConstructions = exports.updateConstruction = exports.AddConstruction = void 0;
const utility_1 = require("../utils/utility");
const construction_model_1 = __importDefault(require("../model/construction.model"));
const pictures_model_1 = __importDefault(require("../model/pictures.model"));
const AddConstruction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateResult = utility_1.ConstructionSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({ error: validateResult.error.details[0].message });
        }
        const { coverPhoto, title, description, location, status, clientName, year, videos } = req.body;
        const newConstruction = yield construction_model_1.default.create({
            coverPhoto, title,
            description: description || "",
            location: location || "",
            status: status || "Ongoing",
            clientName: clientName || "",
            year: year || "",
            videos: videos || [],
        });
        return res.status(200).json({ status: "Success", data: newConstruction });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.AddConstruction = AddConstruction;
const updateConstruction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, location, status, clientName, year, videos } = req.body;
        const updated = yield construction_model_1.default.findByIdAndUpdate(id, { $set: { title, description, location, status, clientName, year, videos } }, { new: true });
        if (!updated)
            return res.status(404).json({ message: "Construction not found" });
        return res.status(200).json({ status: "Success", data: updated });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateConstruction = updateConstruction;
const getAllConstructions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const constructions = yield construction_model_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({ status: "Success", data: constructions });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllConstructions = getAllConstructions;
const deleteConstruct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drawingId = req.params.id;
        const productToDelete = yield construction_model_1.default.findById(drawingId);
        if (!productToDelete)
            return res.status(404).json({ message: "Product not found" });
        yield pictures_model_1.default.deleteMany({ drawingId });
        yield construction_model_1.default.findByIdAndDelete(drawingId);
        return res.status(200).json({ status: "Success", message: "Product deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteConstruct = deleteConstruct;
const getConstructById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const drawingId = req.params.id;
    try {
        const drawing = yield construction_model_1.default.findById(drawingId).populate("pictures");
        if (!drawing)
            return res.status(404).json({ message: "Drawing not found" });
        return res.status(200).json({ status: "Success", data: drawing });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getConstructById = getConstructById;
