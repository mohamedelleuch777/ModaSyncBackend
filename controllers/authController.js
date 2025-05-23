// import UsersModel from '@models/usersModel';
import AuthModel from "../models/authModel.js";
import FUNCTIONS from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE_AFTER } from '../config/env.js';
import exportedFunctions from '../middlewares/authMiddlewares.js';

const {getCurrentUserID } = exportedFunctions;
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
            delete user.password;
            const token = jwt.sign({ user: user, id: user.id, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_AFTER });
            console.log('✅ Login successful. userId:', user.id);
            res.json({ token });
        } catch (error) {
            console.log('❌ Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Reset Password
    static async resetPassword(req, res) {
        try {
            const { oldPassword, newPassword, confirmation } = req.body;
            const userId = await getCurrentUserID(req, res);

            if (!oldPassword || !newPassword || !confirmation) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }

            if (newPassword !== confirmation) {
                return res.status(400).json({ error: "Password confirmation does not match" });
            }

            const user = await AuthModel.getUserById(userId, true);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isMatch = await comparePassword(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Old password is incorrect" });
            }

            const hashedPassword = await hashPassword(newPassword);
            await AuthModel.updateUserPassword(userId, hashedPassword);

            console.log(`✅ Password updated for userId: ${userId}`);
            res.json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            console.log("❌ Password reset failed", error.message);
            res.status(500).json({ error: error.message });
        }
    }
    

}

export default AuthController;
