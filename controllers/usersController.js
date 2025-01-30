// import UsersModel from '@models/usersModel';
import UsersModel from "../models/usersModel.js";
import FUNCTIONS from '../utils/hash.js';

const { hashPassword, comparePassword } = FUNCTIONS;

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

}

export default UsersController;
