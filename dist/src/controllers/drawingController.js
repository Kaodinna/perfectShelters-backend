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
exports.getAllDrawings = exports.AddDrawing = void 0;
const utility_1 = require("../utils/utility");
const drawingModel_1 = __importDefault(require("../model/drawingModel"));
const db_config_1 = require("../config/db.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
            const payload = {
                email: newDrawing.refNo, // Include other necessary fields
            };
            const secret = `${db_config_1.JWT_KEY}verifyThisaccount`; // Ensure that you have JWT_KEY set in your environment variables
            const signature = jsonwebtoken_1.default.sign(payload, secret);
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
        const drawings = yield drawingModel_1.default.find();
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
