import { Router, Request, Response } from "express";
import Servidor from "../classes/servidor";
import { usuariosConectados } from "../sockets/socket";

const router = Router();

router.get("/mensajes", (req: Request, resp: Response) => {
  resp.json({
    ok: true,
    mensaje: "Todo esta bien!!",
  });
});

router.post("/mensajes", (req: Request, resp: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  const payload = {
    cuerpo,
    de,
  };

  const server = Servidor.instance;
  server.io.emit("mensaje-nuevo", payload);

  resp.json({
    ok: true,
    cuerpo: cuerpo,
    de: de,
  });
});

// recuperacion de mensajes privados
router.post("/mensajes/:id", (req: Request, resp: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo,
  };

  const server = Servidor.instance;

  server.io.in(id).emit("mensaje-privado", payload);

  resp.json({
    ok: true,
    cuerpo: cuerpo,
    de: de,
    id: id,
  });
});

// servicio para obtener todos los id's de los usuarios
router.get("/usuarios", async (req: Request, resp: Response) => {
  const server = Servidor.instance;

  const sockets = await server.io.fetchSockets();

  const ids: string[] = [];
  sockets.forEach((socket) => {
      ids.push(socket.id)
  })

  return resp.json({
      ok: true,
      clientes: ids
  });
 
});

// obterner usuarios y sus nombres
router.get("/usuarios/detalle", async (req: Request, resp: Response) => {
    
    return resp.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });
});

export default router;
