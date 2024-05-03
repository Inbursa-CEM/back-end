import Server from '../providers/server';
import { PORT, NODE_ENV } from '../config';
import express from 'express';
import UsuarioController from '../controllers/UsuarioController';
import TransaccionController from '../controllers/TransaccionController';
import LlamadaController from '../controllers/LlamadaController';

const server = new Server({
    port: PORT,
    env: NODE_ENV,
    middlewares: [
        express.json(),
        express.urlencoded({ extended: true })
    ],
    controllers: [
        UsuarioController.instance,
        TransaccionController.instance,
        LlamadaController.instance
    ]
});

server.init();