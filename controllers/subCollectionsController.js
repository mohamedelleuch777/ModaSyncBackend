import SubCollectionsModel from "../models/subCollectionsModel.js";

class SubCollectionsController {
    // ✅ Get all sub-collections for a given collection ID
    static async getAllSubCollections(req, res) {
        try {
            const { collectionId } = req.params;
            const subCollections = await SubCollectionsModel.getAllSubCollections(collectionId);
            res.json(subCollections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Create a new sub-collection
    static async createSubCollection(req, res) {
        try {
            const { collectionId, name, description } = req.body;
            if (!collectionId || !name || !description) {
                return res.status(400).json({ error: "Collection ID, name, and description are required" });
            }

            const newSubCollection = await SubCollectionsModel.createSubCollection(collectionId, name, description);
            res.status(201).json(newSubCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Edit a sub-collection
    static async editSubCollection(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ error: "Name and description are required" });
            }

            const updatedSubCollection = await SubCollectionsModel.editSubCollection(id, name, description);
            res.json(updatedSubCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Remove a sub-collection
    static async removeSubCollection(req, res) {
        try {
            const { id } = req.params;
            const deletedSubCollection = await SubCollectionsModel.removeSubCollection(id);
            res.json(deletedSubCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default SubCollectionsController;
