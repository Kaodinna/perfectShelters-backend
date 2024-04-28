"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.constructionSchema = new mongoose_1.default.Schema({
    coverPhoto: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    pictures: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Pictures" }],
}, { timestamps: true });
const Construction = mongoose_1.default.model("construction", exports.constructionSchema);
exports.default = Construction;
