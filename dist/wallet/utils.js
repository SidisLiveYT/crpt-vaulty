"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ENCRYPTION_KEY = process.env.SC_ENCRYPTION_KEY || ""; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
function encrypt(text, encryptionKey = ENCRYPTION_KEY) {
    let iv = Buffer.from(crypto_1.default.randomBytes(IV_LENGTH))
        .toString("hex")
        .slice(0, IV_LENGTH);
    let cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv + ":" + encrypted.toString("hex");
}
exports.encrypt = encrypt;
function decrypt(text, encryptionKey = ENCRYPTION_KEY) {
    let textParts = text.includes(":") ? text.split(":") : [];
    let iv = Buffer.from(textParts.shift() || "", "binary");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.decrypt = decrypt;
