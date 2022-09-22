"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = void 0;
const crypto_1 = require("crypto");
function encode(text, hash = "sha256", digest = "base64", length = 32) {
    return (0, crypto_1.createHash)(hash).update(text).digest(digest).substring(0, length);
}
exports.encode = encode;
