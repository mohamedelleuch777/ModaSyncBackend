import CollectionsModel from '../models/collectionsModel.js';
import { sseEmitter } from '../middlewares/sseEmitterMiddlewares.js';
import exportedFunctions from '../middlewares/authMiddlewares.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

const {getCurrentUserID } = exportedFunctions;

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

    // Get All Users
    static async getCollectionById(req, res) {
        try {
            const { id } = req.params;
            const collection = await CollectionsModel.getCollectionById(id);
            res.json(collection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Create a New Collection
    static async createCollection(req, res) {
        try {
            const { name, description, imageUrl } = req.body;
            const userId = await getCurrentUserID(req, res);

            if (!name || !description) {
                return res.status(400).json({ error: "Name and description are required" });
            }

            const newCollection = await CollectionsModel.createCollection(name, description, imageUrl);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'collection',
                userId: userId,
                data: newCollection, 
                action: 'create',
                message: "New Collection Created"
            });
            res.status(201).json(newCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Edit a Collection
    static async editCollection(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || !description) return res.status(400).json({ error: "Name and description are required" });

            const updatedCollection = await CollectionsModel.editCollection(id, name, description);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'collection',
                data: updatedCollection,
                action: 'edit',
                message: "Collection Edited"
            });
            res.json(updatedCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Remove a Collection
    static async removeCollection(req, res) {
        try {
            const { id } = req.params;
            const deletedCollection = await CollectionsModel.removeCollection(id);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'collection',
                data: deletedCollection,
                action: 'remove',
                message: "Collection Removed"
            });
            res.json(deletedCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default CollectionsController;
