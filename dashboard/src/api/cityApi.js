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
exports.cityApi = void 0;
const axios_1 = __importDefault(require("axios"));
// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api';
// In a real app, this should securely fetched or the endpoint should not require it if same-origin + cookie
const API_KEY = 'test-key-123';
const apiClient = axios_1.default.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
    },
});
exports.cityApi = {
    listCities: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 100) {
        const response = yield apiClient.get('/cities', {
            params: { page, limit },
        });
        return response.data;
    }),
    getActiveCities: () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.get('/cities/active');
        return response.data;
    }),
    getCityBySlug: (slug) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.get(`/cities/${slug}`);
        return response.data;
    }),
    createCity: (cityData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.post('/cities', cityData);
        return response.data;
    }),
    updateCity: (slug, cityData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.put(`/cities/${slug}`, cityData);
        return response.data;
    }),
    toggleCityStatus: (slug) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.patch(`/cities/${slug}/status`);
        return response.data;
    }),
    deleteCity: (slug) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.delete(`/cities/${slug}`);
        return response.data;
    }),
    deleteCities: (slugs) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield apiClient.delete('/cities', { data: { slugs } });
        return response.data;
    }),
};
