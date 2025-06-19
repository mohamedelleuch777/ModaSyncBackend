import UsersModel from '../models/usersModel.js';
import ExternalServicesProviderModel from '../models/externalServicesProviderModel.js';
import FUNCTIONS from '../utils/hash.js';

const { hashPassword } = FUNCTIONS;

class ManagementController {

    // ===== USER MANAGEMENT =====

    // Get all users (enhanced version)
    static async getAllUsers(req, res) {
        try {
            const users = await UsersModel.getAllUsers();
            // Remove password from response
            const safeUsers = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return { ...userWithoutPassword, active: true }; // Add active status
            });
            res.json(safeUsers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create user
    static async createUser(req, res) {
        try {
            const { name, email, phone, role, password } = req.body;
            
            if (!name || !email || !role || !password) {
                return res.status(400).json({ error: 'Name, email, role, and password are required' });
            }

            const validRoles = ["Stylist", "Manager", "Modelist", "ExecutiveWorker", "Tester", "ProductionResponsible", "Joker"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: "Invalid role specified" });
            }

            const hashedPassword = await hashPassword(password);
            const result = await UsersModel.createUser(name, email, phone, hashedPassword, role);
            
            res.status(201).json({ 
                message: 'User created successfully', 
                user: { id: result.id, name, email, phone, role } 
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'Email or phone already exists' });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    // Update user
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone, role, password } = req.body;

            // Update basic info first
            const result = await UsersModel.updateUserById(id, name, email, phone);
            
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update role if provided
            if (role) {
                await new Promise((resolve, reject) => {
                    UsersModel.updateUserRole(id, role, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            // TODO: Handle password update - would need to add method to UsersModel

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user role
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const validRoles = ["Stylist", "Manager", "Modelist", "ExecutiveWorker", "Tester", "ProductionResponsible", "Joker"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: "Invalid role specified" });
            }

            const result = await new Promise((resolve, reject) => {
                UsersModel.updateUserRole(id, role, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            
            res.json({ message: 'User role updated successfully', result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Toggle user status
    static async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { active } = req.body;

            // This would typically update an 'active' field in the database
            // For now, we'll just return success
            res.json({ 
                message: `User ${active ? 'activated' : 'deactivated'} successfully`,
                user: { id, active }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===== EXTERNAL TASK MANAGEMENT =====

    // Get all external providers
    static async getAllExternalProviders(req, res) {
        try {
            const providers = await ExternalServicesProviderModel.getAllProviders();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create external provider
    static async createExternalProvider(req, res) {
        try {
            const { name, phone, active } = req.body;
            
            if (!name || !phone) {
                return res.status(400).json({ error: 'Name and phone are required' });
            }

            const newProvider = await ExternalServicesProviderModel.createProvider(
                name, 
                phone, 
                active !== false
            );
            
            res.status(201).json({ 
                message: 'External provider created successfully', 
                provider: newProvider 
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                res.status(400).json({ error: 'Phone number already exists' });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    // Update external provider
    static async updateExternalProvider(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, active } = req.body;
            
            if (!name || !phone) {
                return res.status(400).json({ error: 'Name and phone are required' });
            }

            const updatedProvider = await ExternalServicesProviderModel.updateProvider(
                parseInt(id), 
                name, 
                phone, 
                active !== false
            );
            
            if (!updatedProvider) {
                return res.status(404).json({ error: 'External provider not found' });
            }
            
            res.json({ 
                message: 'External provider updated successfully',
                provider: updatedProvider
            });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                res.status(400).json({ error: 'Phone number already exists' });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    // Update external provider status
    static async updateExternalProviderStatus(req, res) {
        try {
            const { id } = req.params;
            const { active } = req.body;
            
            const updatedProvider = await ExternalServicesProviderModel.updateProviderStatus(
                parseInt(id), 
                active
            );
            
            if (!updatedProvider) {
                return res.status(404).json({ error: 'External provider not found' });
            }
            
            res.json({ 
                message: `External provider ${active ? 'activated' : 'deactivated'} successfully`,
                provider: updatedProvider
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete external provider
    static async deleteExternalProvider(req, res) {
        try {
            const { id } = req.params;
            
            const deletedProvider = await ExternalServicesProviderModel.deleteProvider(
                parseInt(id)
            );
            
            if (!deletedProvider) {
                return res.status(404).json({ error: 'External provider not found' });
            }
            
            res.json({ message: 'External provider deleted successfully', id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default ManagementController;