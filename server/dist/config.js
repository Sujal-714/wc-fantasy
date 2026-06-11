"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing env var: ${key}`);
    return value;
};
exports.config = {
    database_url: required('DATABASE_URL'),
    jwt_secret: required('JWT_SECRET'),
    port: Number(process.env.PORT) || 3000,
};
