"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transfer_1 = require("../controllers/transfer");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.patch('/', auth_1.authenticate, transfer_1.transferPlayer);
exports.default = router;
