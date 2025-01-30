// import UsersModel from '@models/usersModel';
import UsersModel from "../models/usersModel.js";
import FUNCTIONS from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const { hashPassword, comparePassword } = FUNCTIONS;

class UsersController {
    // Register User
    static async register(req, res) {
        try {
            const { name, email, phone, password, role } = req.body;
            const hashedPassword = await hashPassword(password);
            const user = await UsersModel.createUser(name, email, phone, hashedPassword, role);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Login User
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UsersModel.getUserByEmail(email);
            if (!user) return res.status(400).json({ error: 'Invalid credentials' });

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get All Users
    static async getAllUsers(req, res) {
        try {
            const users = await UsersModel.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get User by Email
    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UsersModel.getUserByEmail(email);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get User by Phone
    static async getUserByPhone(req, res) {
        try {
            const { phone } = req.params;
            const user = await UsersModel.getUserByPhone(phone);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default UsersController;
