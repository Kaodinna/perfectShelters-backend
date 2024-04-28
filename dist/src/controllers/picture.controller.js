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
exports.AddPicture = void 0;
const utility_1 = require("../utils/utility");
const pictures_model_1 = __importDefault(require("../model/pictures.model"));
const construction_model_1 = __importDefault(require("../model/construction.model"));
const AddPicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { picture, details, drawingId } = req.body;
        const validateResult = utility_1.pictureSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }
        const newPicture = yield pictures_model_1.default.create({
            picture,
            details,
            drawingId,
        });
        const drawing = yield construction_model_1.default.findById(drawingId);
        if (!drawing) {
            return res.status(400).json({
                stamessagetus: "Construction not found",
            });
        }
        if (drawing) {
            drawing.pictures.push(newPicture._id);
            yield drawing.save();
        }
        if (newPicture) {
            return res.status(200).json({
                status: "Success",
                data: newPicture, // Return the newly created user object
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
exports.AddPicture = AddPicture;
