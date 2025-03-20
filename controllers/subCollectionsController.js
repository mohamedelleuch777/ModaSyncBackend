import SubCollectionsModel from "../models/subCollectionsModel.js";
import SamplesModel from "../models/samplesModel.js";
import { sseEmitter } from "../middlewares/sseEmitterMiddlewares.js";

class SubCollectionsController {
    // ✅ Get all sub-collections for a given collection ID
    static async getAllSubCollections(req, res) {
        try {
            const { collectionId } = req.params;
            const subCollections = await SubCollectionsModel.getAllSubCollections(collectionId);

            // get the cound of samples for this given sub-collection
            for (const subCollection of subCollections) {
                const samples = await SamplesModel.getAllSamples(subCollection.id);
                subCollection.count = samples.length;
            }
            res.json(subCollections);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Create a new sub-collection
    static async createSubCollection(req, res) {
        try {
            const { collectionId, name, description, imageUrl } = req.body;
            if (!collectionId || !name || !description) {
                return res.status(400).json({ error: "Collection ID, name, and description are required" });
            }

            const newSubCollection = await SubCollectionsModel.createSubCollection(collectionId, name, description, imageUrl);
            sseEmitter.emit('message', {
                type: 'sub-collection',
                collectionId: collectionId,
                data: newSubCollection, 
                action: 'create',
                message: "New Sub-Collection Created"
            });
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
            sseEmitter.emit('message', {
                type: 'sub-collection',
                subCollectionId: id,
                data: updatedSubCollection, 
                action: 'edit',
                message: "Sub-Collection Edited"
            });
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
            sseEmitter.emit('message', {
                type: 'sub-collection',
                subCollectionId: id,
                data: deletedSubCollection, 
                action: 'remove',
                message: "Sub-Collection Removed"
            });
            res.json(deletedSubCollection);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default SubCollectionsController;
