"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
function sendResponse(res, status = 200, success = true, message = "" || {}, data = {}, pagination = {}) {
    const response = {
        status,
        success,
        message,
        pagination,
        data,
    };
    return res.status(status).json(response);
}
exports.sendResponse = sendResponse;
