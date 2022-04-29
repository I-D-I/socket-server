import express from 'express';
import { SERVER_PORT } from '../global/environment';
import { Server } from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';

export default class Servidor {

    private static _instance: Servidor;
    public app: express.Application;
    public port: number;

    private httpServer: http.Server;
    public io: Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = http.createServer( this.app );
        this.io = new Server( this.httpServer, {
            cors: {
                origin: "http://localhost:4200",
                methods: ["GET", "POST"]
            }
        } );
        this.escucharSockets();
    }
    
    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            //console.log( cliente.id );

            // Conectar cliente
            socket.conectarCliente ( cliente, this.io );

            //configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // obtener usuarios activos
            socket.obtenerUsuarios( cliente, this.io );

            socket.mensaje( cliente, this.io );

            //desconectar
            socket.desconectar( cliente, this.io );

        });
    }

    start( callback: any ) {
        this.httpServer.listen( this.port, callback);
    }
}