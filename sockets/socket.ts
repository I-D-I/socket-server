import { Socket, Server } from "socket.io";
import { Usuario } from "../classes/usuario";
import { UsuariosLista } from "../classes/usuarios-lista";

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket, io: Server) => {
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

// Desconectar usuario
export const desconectar = (cliente: Socket, io: Server) => {
  cliente.on("disconnect", () => {
    usuariosConectados.borrarUsuario(cliente.id);
    io.emit( 'usuarios-activos', usuariosConectados.getLista() );
  });
};

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: Server) => {
  cliente.on("mensaje", (payload: { de: string; cuepo: string }, callback) => {
    console.log("Mensaje recibido", payload);

    io.emit("mensaje-nuevo", payload);
  });
};

// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: Server) => {
  cliente.on("configurar-usuario", (payload: { nombre: string }, callback) => {
    usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
    io.emit( 'usuarios-activos', usuariosConectados.getLista() );
    callback({
      ok: true,
      mensaje: `Usuario ${payload.nombre} configurado`,
    });
  });
};


// Obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: Server) => {
  cliente.on("obtener-usuarios", () => {
    
    io.to( cliente.id ).emit( 'usuarios-activos', usuariosConectados.getLista() );
    
  });
};