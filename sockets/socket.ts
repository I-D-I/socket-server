import { Socket } from 'socket.io';
import { Server } from 'socket.io';

export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuepo: string }, callback ) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}