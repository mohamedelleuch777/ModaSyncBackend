// import UsersModel from '@models/usersModel';
import UsersModel from "../models/usersModel.js";
import FUNCTIONS from '../utils/hash.js';

class UsersController {

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

    // Delete User
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await UsersModel.deleteUserById(id);

            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Edit User
    static async editUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone } = req.body;

            const result = await UsersModel.updateUserById(id, name, email, phone);

            if (!result) {
                return res.status(404).json({ error: 'User not found or no fields to update' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Function to update user role (Only for Managers)
    static updateUserRole = (req, res) => {
        const { id } = req.params; // User ID to update
        const { role } = req.body; // New role
    
        if (!role) {
            return res.status(400).json({ error: "Role is required" });
        }
    
        const validRoles = ["Stylist", "Manager", "Modelist", "ExecutiveWorker", "Tester"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role specified" });
        }
    
        UsersModel.updateUserRole(id, role, (err, result) => {
            if (err) {
                console.error("🚨 Error updating user role:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
    
            if (result.error) {
                return res.status(404).json(result);
            }
    
            res.json(result);
        });
    };

}

export default UsersController;
