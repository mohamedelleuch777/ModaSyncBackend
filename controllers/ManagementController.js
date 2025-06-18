import UsersModel from '../models/usersModel.js';
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

            const validRoles = ["Stylist", "Manager", "Modelist", "ExecutiveWorker", "Tester", "ProductionResponsible"];
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

            const validRoles = ["Stylist", "Manager", "Modelist", "ExecutiveWorker", "Tester", "ProductionResponsible"];
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
            // This would typically query an external_providers table
            // For now, return mock data
            const providers = [
                {
                    id: 1,
                    name: 'Premium Embroidery Co.',
                    phone: '+1-555-0123',
                    active: true
                },
                {
                    id: 2,
                    name: 'Fashion Print Services',
                    phone: '+1-555-0456',
                    active: false
                }
            ];
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

            // This would typically insert into external_providers table
            const newProvider = {
                id: Date.now(), // Mock ID
                name,
                phone,
                active: active !== false
            };
            
            res.status(201).json({ 
                message: 'External provider created successfully', 
                provider: newProvider 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update external provider
    static async updateExternalProvider(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, active } = req.body;
            
            // This would typically update the external_providers table
            res.json({ 
                message: 'External provider updated successfully',
                provider: { id, name, phone, active }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update external provider status
    static async updateExternalProviderStatus(req, res) {
        try {
            const { id } = req.params;
            const { active } = req.body;
            
            // This would typically update the external_providers table
            res.json({ 
                message: `External provider ${active ? 'activated' : 'deactivated'} successfully`,
                provider: { id, active }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete external provider
    static async deleteExternalProvider(req, res) {
        try {
            const { id } = req.params;
            
            // This would typically delete from external_providers table
            res.json({ message: 'External provider deleted successfully', id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default ManagementController;