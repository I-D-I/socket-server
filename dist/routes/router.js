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
const express_1 = require("express");
const servidor_1 = __importDefault(require("../classes/servidor"));
const socket_1 = require("../sockets/socket");
const router = (0, express_1.Router)();
router.get("/mensajes", (req, resp) => {
    resp.json({
        ok: true,
        mensaje: "Todo esta bien!!",
    });
});
router.post("/mensajes", (req, resp) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const payload = {
        cuerpo,
        de,
    };
    const server = servidor_1.default.instance;
    server.io.emit("mensaje-nuevo", payload);
    resp.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
    });
});
// recuperacion de mensajes privados
router.post("/mensajes/:id", (req, resp) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const payload = {
        de,
        cuerpo,
    };
    const server = servidor_1.default.instance;
    server.io.in(id).emit("mensaje-privado", payload);
    resp.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
        id: id,
    });
});
// servicio para obtener todos los id's de los usuarios
router.get("/usuarios", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const server = servidor_1.default.instance;
    const sockets = yield server.io.fetchSockets();
    const ids = [];
    sockets.forEach((socket) => {
        ids.push(socket.id);
    });
    return resp.json({
        ok: true,
        clientes: ids
    });
}));
// obterner usuarios y sus nombres
router.get("/usuarios/detalle", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    return resp.json({
        ok: true,
        clientes: socket_1.usuariosConectados.getLista()
    });
}));
exports.default = router;
