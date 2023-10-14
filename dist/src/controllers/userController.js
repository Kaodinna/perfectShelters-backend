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
exports.Login = exports.verifyAccount = exports.Register = void 0;
const utility_1 = require("../utils/utility");
const userModel_1 = __importDefault(require("../model/userModel"));
const db_config_1 = require("../config/db.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**========================REGISTER USER==========================**/
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, address, password, } = req.body;
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        const existingUser = yield userModel_1.default.findOne({ email });
        if (!existingUser) {
            const newUser = yield userModel_1.default.create({
                email,
                password: userPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
            });
            const payload = {
                email: newUser.email, // Include other necessary fields
            };
            const secret = `${db_config_1.JWT_KEY}verifyThisaccount`; // Ensure that you have JWT_KEY set in your environment variables
            const signature = jsonwebtoken_1.default.sign(payload, secret);
            if (newUser) {
                return res.status(200).json({
                    status: 'Success',
                    data: newUser, // Return the newly created user object
                });
            }
        }
        return res.status(400).json({
            message: 'User already exists',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});
exports.Register = Register;
/**========================Verify USER==========================**/
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const secretKey = `${db_config_1.JWT_KEY}verifyThisaccount`;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield userModel_1.default.findOne({ email: decoded.email });
        if (user) {
            user.accountStatus = true;
            const updatedUser = yield user.save();
            if (updatedUser) {
                const url = `https://investement.vercel.app/user-login`;
                res.redirect(url);
                // Return a success message along with the URL
            }
            else {
                throw new Error("Account activation failed");
            }
        }
        else {
            throw new Error("No record found for the provided email");
        }
    }
    catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
});
exports.verifyAccount = verifyAccount;
/**========================LOGIN USER==========================**/
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            if (!user.accountStatus) {
                return res.status(403).json({
                    message: "Your account is not activated Please check your email for verification Link",
                });
            }
            const validation = yield (0, utility_1.validatePassword)(password, user.password, user.salt);
            if (validation) {
                // Generate a JWT token
                const payload = {
                    email: user.email,
                    _id: user._id, // Include other necessary fields
                };
                const secret = `${db_config_1.JWT_KEY}verifyThisaccount`;
                const token = jsonwebtoken_1.default.sign(payload, secret);
                // Return user details and token
                return res.status(200).json({
                    message: "You have successfully logged in",
                    user: {
                        _id: user._id,
                        email: user.email,
                        // Include other user details here
                    },
                    token,
                });
            }
        }
        return res.status(400).json({
            message: "Wrong username or password",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
});
exports.Login = Login;
