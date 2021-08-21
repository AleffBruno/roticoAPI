"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var authConfig_1 = require("./authConfig");
function ensureAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
        // throw new AppError('Faltando token', 401);
        return response.json({ msg: "falta token" });
    }
    var _a = authHeader.split(' '), token = _a[1];
    try {
        var decoded = jsonwebtoken_1.verify(token, authConfig_1.default.jwt.secret);
        var sub = decoded.sub;
        response.locals.jwtPayload = sub;
        return next();
    }
    catch (err) {
        // throw new AppError('Token invalido', 401);
        return response.json({ msg: "Token invalido" });
    }
}
exports.default = ensureAuthenticated;
