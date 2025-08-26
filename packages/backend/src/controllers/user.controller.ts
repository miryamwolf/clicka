import { UserModel } from "../models/user.model";
import { generateJwtToken } from "../services/authService";
import { setAuthCookie } from "../services/tokenService";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

export class UserController {
    userService = new UserService();
    async createUser(req: Request, res: Response) {
        const userData = req.body;
        console.log('Prepared user data:', JSON.stringify(userData, null, 2));
        const user = new UserModel(userData);
        const result = await this.userService.createUser(user);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        const result = await this.userService.getAllUsers();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const result = await this.userService.getUserById(userId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }

    async loginByGoogleId(req: Request, res: Response) {
        const googleId = req.params.googleId;
        if (!googleId) {
            return res.status(400).json({ error: "Google ID is required" });
        }
        try {
            const result = await this.userService.loginByGoogleId(googleId);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to login by Google ID" });
            console.error('Error in loginByGoogleId:', error);
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        const email = req.params.email;
        const result = await this.userService.getUserByEmail(email);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }

    async updateGoogleIdUser(req: Request, res: any) {
        const userId = req.params.id;
        const googleId = req.body.googleId;

        if (!googleId) {
            return res.status(400).json({ error: "Google ID is required" });
        }

        const result = await this.userService.updateGoogleIdUser(userId, googleId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to update Google ID" });
        }
    }

    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = new UserModel(updatedData);
        console.log('Prepared user data:', JSON.stringify(updatedData, null, 2));
        try {
            const result = await this.userService.updateUser(userId, updatedUser);
            if (result) {
                const newJwt = generateJwtToken({ userId: result.id || '', email: result.email || '', role: result.role || '', googleId: result.googleId || '' });
                setAuthCookie(res,newJwt);
                res.status(200).json(result);
            } else {
                res.status(500).json({ error: "Failed to update user" });
            }
        } catch (error) {
            res.status(404).json({ error: "User not found" });
        }

    }

    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;
        try {
            const result = await this.userService.deleteUser(userId);
            if (result) {
                res.status(204).send();
            } else {
                res.status(500).json({ error: "Failed to delete user" });
            }
        } catch (error) {
            res.status(404).json({ error: "User not found" });
        }

    }

}