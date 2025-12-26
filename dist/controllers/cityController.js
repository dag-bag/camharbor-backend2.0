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
exports.getAllCities = exports.getCityBySlug = exports.createCity = void 0;
const City_1 = __importDefault(require("../models/City"));
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = new City_1.default(req.body);
        const savedCity = yield city.save();
        res.status(201).json({ success: true, data: savedCity });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.createCity = createCity;
const getCityBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield City_1.default.findOne({ slug: req.params.slug });
        if (!city) {
            return res.status(404).json({ success: false, error: 'City not found' });
        }
        res.status(200).json({ success: true, data: city });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.getCityBySlug = getCityBySlug;
const getAllCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cities = yield City_1.default.find({ is_active: true });
        res.status(200).json({ success: true, count: cities.length, data: cities });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.getAllCities = getAllCities;
