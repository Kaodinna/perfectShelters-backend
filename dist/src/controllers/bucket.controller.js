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
exports.BucketController = void 0;
const axios_1 = __importDefault(require("axios"));
const bucket_model_1 = require("../model/bucket.model");
const cloud_1 = require("../helpers/cloud");
const response_1 = require("../helpers/response");
class BucketController {
    addToBucket(res, files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!files) {
                return (0, response_1.sendResponse)(res, 500, false, "No Files Uploaded!");
            }
            const buckets = [];
            for (let i = 0; i < files.length; i++) {
                const { path, fieldname } = files[i];
                try {
                    const upload = yield (0, cloud_1.uploadToCloudinary)(path);
                    const toBucket = yield bucket_model_1.Bucket.create({
                        data: upload,
                        url: upload.secure_url,
                    });
                    buckets.push({
                        bucket: toBucket,
                        fieldname,
                        id: toBucket._id.toString(),
                    });
                }
                catch (error) {
                    console.log(error);
                    buckets.push({
                        bucket: false,
                        fieldname,
                        error: error.message,
                    });
                    return (0, response_1.sendResponse)(res, 500, false, "There was an error adding files added to Bucket", buckets);
                }
            }
            return (0, response_1.sendResponse)(res, 200, true, "Files added to Bucket", buckets);
        });
    }
    getBucket(res, bucketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucket = yield bucket_model_1.Bucket.findById(bucketId);
                if (bucket === null) {
                    return (0, response_1.sendResponse)(res, 404, false, "Bucket Not Found!");
                }
                const { secure_url } = bucket.data;
                const { data } = yield axios_1.default.get(secure_url, {
                    responseType: "stream",
                });
                data.pipe(res);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.sendResponse)(res, 404, false, "Error fetching bucket!");
            }
        });
    }
}
exports.BucketController = BucketController;
