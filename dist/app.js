"use strict";
// your-project-name/src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_handler_1 = require("./middlewares/error.handler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)()); // Helps set various HTTP headers to bolster security
app.use((0, compression_1.default)()); // Compresses response bodies for improved performance
app.set("trust proxy", 1); // trust first proxy
// Set up request logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev")); // Using 'dev' format for logging in development mode
}
else {
    app.use((0, morgan_1.default)("combined"));
}
// Set up rate limiter: max 100 requests per minute per IP
const limiter = (0, express_rate_limit_1.default)({ windowMs: 30 * 1000, max: 100 });
app.use("/api/", limiter); // Applying rate limiting to /api/ routes
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});
app.use("/api", index_routes_1.default);
app.use(error_handler_1.notFound);
app.use(error_handler_1.generalError);
if (process.env.NODE_ENV === "development") {
    //  listEndpoints(app);
}
exports.default = app;
