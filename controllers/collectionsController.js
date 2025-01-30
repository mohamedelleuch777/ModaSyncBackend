import CollectionsModel from '../models/collectionsModel.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

class CollectionsController {

    // Get All Users
    static async getAllCollections(req, res) {
        try {
            const collections = await CollectionsModel.getAllCollections();
            res.json(collections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Create a New Collection
    static async createCollection(req, res) {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ error: "Name and description are required" });
            }

            const newCollection = await CollectionsModel.createCollection(name, description);
            res.status(201).json(newCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default CollectionsController;
