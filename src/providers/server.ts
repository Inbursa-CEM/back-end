// const express = require('express'); Eso es JS
import express from 'express';
import AbstractController from '../controllers/AbstractController';
import db from '../models';

class Server {
    // Atributos de la clase
    private app!: express.Application;
    private port!: number;
    private env!: string;

    constructor(appInit: { port: number; env: string; middlewares: any[]; controllers: AbstractController[] }) {
        this.app = express();
        this.port = appInit.port;
        this.env = appInit.env;
        this.loadRoutes(appInit.controllers);
        this.loadMiddlewares(appInit.middlewares);
        this.connectDB();
    }

    private loadRoutes(controllers: AbstractController[]) {
        controllers.forEach(controller => {
            this.app.use(`/${controller.prefix}`, controller.router);
        });
    }

    private async connectDB() {
        await db.sequelize.sync();
    }

    private loadMiddlewares(middlewares: any[]) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    
    }

    public init() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
        // this.connectDB();
    }
}

export default Server;