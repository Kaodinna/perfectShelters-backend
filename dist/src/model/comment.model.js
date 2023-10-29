"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", exports.commentSchema);
exports.default = Comment;
