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
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = __importDefault(require("@mui/material/Button"));
const extension_api_client_1 = require("@docker/extension-api-client");
const material_1 = require("@mui/material");
const client = (0, extension_api_client_1.createDockerDesktopClient)();
function useDockerDesktopClient() {
    return client;
}
function App() {
    const [response, setResponse] = (0, react_1.useState)('');
    const ddClient = useDockerDesktopClient();
    const fetchAndDisplayResponse = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const result = yield ((_b = (_a = ddClient.extension.vm) === null || _a === void 0 ? void 0 : _a.service) === null || _b === void 0 ? void 0 : _b.get('/hello'));
        setResponse(JSON.stringify(result));
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: 'h3', children: "Docker extension demo" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: 'body1', color: 'text.secondary', sx: { mt: 2 }, children: "This is a basic page rendered with MUI, using Docker's theme. Read the MUI documentation to learn more. Using MUI in a conventional way and avoiding custom styling will help make sure your extension continues to look great as Docker's theme evolves." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: 'body1', color: 'text.secondary', sx: { mt: 2 }, children: "Pressing the below button will trigger a request to the backend. Its response will appear in the textarea." }), (0, jsx_runtime_1.jsxs)(material_1.Stack, { direction: 'row', alignItems: 'start', spacing: 2, sx: { mt: 4 }, children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: 'contained', onClick: fetchAndDisplayResponse, children: "Call backend" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: 'Backend response', sx: { width: 480 }, disabled: true, multiline: true, variant: 'outlined', minRows: 5, value: response !== null && response !== void 0 ? response : '' })] })] }));
}
exports.App = App;
