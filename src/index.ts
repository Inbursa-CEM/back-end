import Server from "./providers/Server";
import { PORT, NODE_ENV } from "./config";
import express from "express";
import cors from "cors";
import NotificacionController from "./controllers/NotificacionController";
import UsuarioController from "./controllers/UsuarioController";
import ClienteController from "./controllers/ClienteController";
import LlamadaController from "./controllers/LlamadaController";
import TarjetaController from "./controllers/TarjetaController";
import TransaccionController from "./controllers/TransaccionController";

// const corsOptions = {
//   origin: "http://127.0.0.1:3000",
//   // credentials: true, //access-control-allow-credentials:true
//   // optionSuccessStatus: 200,
// };

const server = new Server({
  port: PORT,
  env: NODE_ENV,
  middlewares: [express.json(), express.urlencoded({ extended: true }), cors()],
  controllers: [
    NotificacionController.instance,
    UsuarioController.instance,
    ClienteController.instance,
    LlamadaController.instance,
    TarjetaController.instance,
    TransaccionController.instance,
  ],
});

server.init();
