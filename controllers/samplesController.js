import SamplesModel from "../models/samplesModel.js";

class SamplesController {
    // ✅ Get all samples for a given subcollection ID
    static async getAllSamples(req, res) {
        try {
            const { subcollectionId } = req.params;
            const samples = await SamplesModel.getAllSamples(subcollectionId);
            res.json(samples);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Create a new sample
    static async createSample(req, res) {
        try {
            const { subcollectionId } = req.body;

            if (!subcollectionId ) {
                return res.status(400).json({ error: "Subcollection ID and status are required" });
            }

            const newSample = await SamplesModel.createSample(subcollectionId);
            res.status(201).json(newSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Edit a sample
    static async editSample(req, res) {
        try {
            const { id } = req.params;
            const { status, timeline } = req.body;

            if (!status) {
                return res.status(400).json({ error: "Status is required" });
            }

            const updatedSample = await SamplesModel.editSample(id, status, timeline);
            res.json(updatedSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Remove a sample
    static async removeSample(req, res) {
        try {
            const { id } = req.params;
            const deletedSample = await SamplesModel.removeSample(id);
            res.json(deletedSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default SamplesController;
