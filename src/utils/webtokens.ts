import jwt from "jsonwebtoken";
import config from "../config";

export function sign(payload: object, expiresIn = "7 days"): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, config.client.secret, { expiresIn: String(expiresIn) }, (err, token) => {
      if (err) return reject(err);
      resolve(token!);
    });
  });
}

export function verify(token: string): Promise<boolean> {
  return new Promise(resolve => {
    jwt.verify(token, config.client.secret, {}, (err, decoded) => resolve(err ? false : Boolean(decoded)));
  });
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function decode<T extends object>(token: string): T {
  return jwt.decode(token, {}) as T;
}
