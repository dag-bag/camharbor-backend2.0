"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cityController_1 = require("../controllers/cityController");
const router = express_1.default.Router();
router.post('/', cityController_1.createCity);
router.get('/', cityController_1.getAllCities);
router.get('/:slug', cityController_1.getCityBySlug);
exports.default = router;
