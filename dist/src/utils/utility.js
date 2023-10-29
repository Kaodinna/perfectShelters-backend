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
exports.validatePassword = exports.loginSchema = exports.Generatesignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.drawingSchema = exports.commentSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = require("../config/db.config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.commentSchema = joi_1.default.object().keys({
    fullName: joi_1.default.string().required(),
    emailAddress: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    comment: joi_1.default.string().required(),
    drawingId: joi_1.default.string().required(),
});
exports.drawingSchema = joi_1.default.object().keys({
    frontElevation: joi_1.default.string().required(),
    rightElevation: joi_1.default.string().required(),
    leftElevation: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    refNo: joi_1.default.string().required(),
    price: joi_1.default.string().required(),
    drawing_details: joi_1.default.array().items(joi_1.default.object().keys({
        floor: joi_1.default.string().required(),
        details: joi_1.default.string().required(),
    })),
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const Generatesignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, db_config_1.APP_SECRET);
});
exports.Generatesignature = Generatesignature;
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
});
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
