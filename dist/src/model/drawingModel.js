"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawingSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.drawingSchema = new mongoose_1.default.Schema({
    frontElevation: {
        type: String,
        rquired: true,
    },
    rightElevation: {
        type: String,
        required: true,
    },
    leftElevation: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    refNo: {
        type: String,
        required: true,
    },
    price: {
        required: true,
        type: String,
    },
    floor: {
        required: true,
        type: String,
    },
    details: {
        required: true,
        type: String,
    },
}, { timestamps: true });
const Drawing = mongoose_1.default.model("drawing", exports.drawingSchema);
exports.default = Drawing;
