"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pictureSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.pictureSchema = new mongoose_1.default.Schema({
    picture: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Pictures = mongoose_1.default.model("Pictures", exports.pictureSchema);
exports.default = Pictures;
