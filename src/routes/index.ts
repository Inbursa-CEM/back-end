import Server from '../providers/server';
import { PORT, NODE_ENV } from '../config';
import express from 'express';
import UsuarioController from '../controllers/UsuarioController';
import TransaccionController from '../controllers/TransaccionController';
import LlamadaController from '../controllers/LlamadaController';
import ClienteController from '../controllers/ClienteController';
import TarjetaController from '../controllers/TarjetaController';

const server = new Server({
    port: PORT,
    env: NODE_ENV,
    middlewares: [
        express.json(),
        express.urlencoded({ extended: true })
    ],
    controllers: [
        UsuarioController.instance,
        LlamadaController.instance,
        ClienteController.instance,
        TarjetaController.instance,
        TransaccionController.instance
    ]
});

server.init();