import { Request, Response } from "express";
import database, { IUser } from "../database";
import AuthService from "../services/auth";

export class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as IUser;

    const userAlreadyExists = await database.get(email);
    if (userAlreadyExists) {
      return res.status(409).json({ error: 'User already exists!' });
    }

    await database.set({ email, password });
    
    return res.status(201).json({ email });
  }

  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as IUser;

    const user = await database.get(email);

    if (!user) {
      return res.status(403).json({ error: 'Email/Password does not match!' });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return res.status(403).json({ error: 'Email/Password does not match!' });
    }

    const token = AuthService.generateToken(user);
    return res.json({ token, user })
  }

  public async listUsers(_: Request, res: Response): Promise<Response> {
    const users = await database.findAllUsers();
    return res.json(users);
  }

  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.user_email;
    if (!email) return res.json(null);
    
    const user = await database.get(String(email));

    if (!user) return res.json(null);

    return res.json({ email: user.email })
  }
}