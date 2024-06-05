import { Router } from "express";

// Middlewares
import AuthMiddleware from "../middleware/authorization";

// Servicios
import CognitoService from "../services/cognitoService";

export default abstract class AbstractController {
  private _router: Router;
  private _prefix: string;

  protected authMiddleware = AuthMiddleware.instance;
  protected cognitoService = CognitoService.instance;

  public get router(): Router {
    return this._router;
  }

  public set router(_router: Router) {
    this._router = _router;
  }

  public get prefix(): string {
    return this._prefix;
  }

  protected constructor(prefix: string) {
    this._router = Router();
    this._prefix = prefix;
    this.initializeRoutes();
  }

  // Inicializar las rutas
  protected abstract initializeRoutes(): void;
}
