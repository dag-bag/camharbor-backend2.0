"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const queryClient_1 = require("./queryClient");
const react_1 = require("react");
const client_1 = require("react-dom/client");
require("./index.css");
const App_tsx_1 = __importDefault(require("./App.tsx"));
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.StrictMode>
    <react_query_1.QueryClientProvider client={queryClient_1.queryClient}>
      <App_tsx_1.default />
    </react_query_1.QueryClientProvider>
  </react_1.StrictMode>);
