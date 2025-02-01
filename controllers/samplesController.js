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

    // ✅ Update sample Status
    static async updateSampleStatus(req, res) {
        try {
            const { sample_id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ error: "Status is required" });
            }

            const updatedSample = await SamplesModel.editSample(sample_id, status);
            res.json(updatedSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default SamplesController;
