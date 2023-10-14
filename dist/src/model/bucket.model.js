"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bucket = void 0;
const mongoose_1 = require("mongoose");
const BucketModal = new mongoose_1.Schema({
    url: { type: String, required: true },
    data: Object,
}, {
    timestamps: true,
});
exports.Bucket = (0, mongoose_1.model)("Bucket", BucketModal);
