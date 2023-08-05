"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const CssBaseline_1 = __importDefault(require("@mui/material/CssBaseline"));
const docker_mui_theme_1 = require("@docker/docker-mui-theme");
const App_1 = require("./App");
react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsxs)(docker_mui_theme_1.DockerMuiThemeProvider, { children: [(0, jsx_runtime_1.jsx)(CssBaseline_1.default, {}), (0, jsx_runtime_1.jsx)(App_1.App, {})] }) }), document.getElementById('root'));
