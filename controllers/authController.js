// import UsersModel from '@models/usersModel';
import AuthModel from "../models/authModel.js";
import FUNCTIONS from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE_AFTER } from '../config/env.js';

const { hashPassword, comparePassword } = FUNCTIONS;

class AuthController {
    // Register User
    static async register(req, res) {
        try {
            const { name, email, phone, password, role } = req.body;
            const hashedPassword = await hashPassword(password);
            const user = await AuthModel.createUser(name, email, phone, hashedPassword, role);
            console.log("✅ Register succeeded", email, phone);
            res.status(201).json(user);
        } catch (error) {
            console.log("❌ Register failed");
            res.status(500).json({ error: error.message });
        }
    }

    // Login User
    static async login(req, res) {
        try {
            const { emailOrPhone, password } = req.body;

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^(?:\+216\s?)?[234579]\d{7}$/;

            let user = null;
            if (emailRegex.test(emailOrPhone)) {
                user = await AuthModel.getUserByEmail(emailOrPhone, true);
            } else if (phoneRegex.test(emailOrPhone)) {
                user = await AuthModel.getUserByPhone(emailOrPhone, true);
            } else {
                console.log("❌ Invalid email or phone format:", emailOrPhone);
                return res.status(400).json({ error: 'Invalid email or phone format' });
            }
            if (!user) {
                console.log('❌ Invalid credentials');
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                console.log('❌ Invalid credentials');
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_AFTER });
            console.log('✅ Login successful. userId:', user.id);
            res.json({ token });
        } catch (error) {
            console.log('❌ Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

export default AuthController;
