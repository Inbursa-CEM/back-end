import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class AuthenticationController extends AbstractController {
  // Singleton
  // Atributo de clase
  private static _instance: AuthenticationController;
  // Método de clase
  public static get instance(): AuthenticationController {
    return this._instance || (this._instance = new this("auth"));
  }

  protected initializeRoutes(): void {
    this.router.post("/signup", this.signup.bind(this));
    this.router.post("/verify", this.verify.bind(this));
    this.router.post("/signin", this.signin.bind(this));
    this.router.post("/logout", this.logout.bind(this));
    this.router.post("/forgotpassword", this.forgotpassword.bind(this));
    this.router.post("/changepassword", this.changepassword.bind(this));
    this.router.get(
      "/test",
      this.authMiddleware.verifyToken,
      this.test.bind(this)
    );
  }

  private async test(req: Request, res: Response) {
    res.status(200).send("Esto es una prueba");
  }

  private async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      // const login = await this.cognitoService.signInUser(email, password);
      const usuario = await db.Usuario.findOne({
        attributes: ["idUsuario", "nombre", "rol", "urlFoto"],
        where: {
          correo: email,
        },
      });
      // if (!usuario || !login.AuthenticationResult) {
      //   res.status(404).send("El usuario no existe");
      //   return;
      // }
      res.status(200).send({ 
        // ...login.AuthenticationResult,
         usuario });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }

  private async verify(req: Request, res: Response) {
    const { email, code } = req.body;
    try {
      await this.cognitoService.verifyUser(email, code);
      console.log("Usuario de cognito verificado", email);
      return res.status(200).send({ message: "verified user" }).end();
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }

  private async signup(req: Request, res: Response) {
    const { correo, password } = req.body;
    console.log(req.body);
    try {
      // Crear usuario en Cognito
      const user = await this.cognitoService.signUpUser(correo, password, [
        {
          Name: "email",
          Value: correo,
        },
      ]);
      if (user) {
        await db["Usuario"].create(req.body);
      }

      console.log("Usuario de cognito creado", user);
      res.status(201).send({ message: "User signed up" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }

  private async logout(req: Request, res: Response) {
    const { accessToken } = req.body;
    try {
      await this.cognitoService.signOutUser(accessToken);
      res.status(200).send({ message: "User logged out" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }

  private async forgotpassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      await this.cognitoService.forgotPassword(email);
      res.status(200).send({ message: "Password reset" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }

  private async changepassword(req: Request, res: Response) {
    const { email, code, password } = req.body;
    try {
      const user = await this.cognitoService.changePassword(
        email,
        code,
        password
      );
      res.status(200).send({ message: "Password changed" });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
}

export default AuthenticationController;
