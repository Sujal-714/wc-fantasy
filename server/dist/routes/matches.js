"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matches_1 = require("../controllers/matches");
const router = (0, express_1.Router)();
router.get('/', matches_1.matches);
exports.default = router;
