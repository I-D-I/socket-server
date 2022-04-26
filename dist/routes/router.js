"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/mensajes', (req, resp) => {
    resp.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    });
});
router.post('/mensajes', (req, resp) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    resp.json({
        ok: true,
        cuerpo: cuerpo,
        de: de
    });
});
router.post('/mensajes/:id', (req, resp) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    resp.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
        id: id
    });
});
exports.default = router;
