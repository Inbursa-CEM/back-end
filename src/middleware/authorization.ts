import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { AWS_REGION, COGNITO_POOL_ID } from "../config";

class AuthMiddleware {
  private static _instance: AuthMiddleware;

  public static get instance(): AuthMiddleware {
    return this._instance || (this._instance = new this());
  }

  public verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const tokenParts = token.split(" ");
    if (tokenParts[0] !== "Bearer" || tokenParts.length !== 2) {
      return res.status(401).send({ message: "Invalid token format" });
    }

    const accessToken = tokenParts[1];

    this.validateToken(accessToken)
      .then(() => {
        next();
      })
      .catch((err) => {
        return res.status(401).send({ message: "Invalid or expired token" });
      });
  };

  private async validateToken(token: string): Promise<void> {
    const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
      region: AWS_REGION,
    });

    const params = {
      AccessToken: token,
    };

    try {
      await cognitoIdentity.getUser(params).promise();
    } catch (err) {
      throw new Error("Invalid token");
    }
  }
}

export default AuthMiddleware;
