import PicturesModel from "../models/picturesModel.js";

class PicturesController {
    
    // Get all sample's pictures
    static async getSample_sPictures(req, res) {
        try {
            const { sampleId } = req.params;
            const pictures = await PicturesModel.fetchPictures(sampleId);
            res.json(pictures);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add pictures to sample
    static async addPictures(req, res) {
        try {
            const { sampleId } = req.params;
            const { title, imageUrl } = req.body;
            const newPicture = await PicturesModel.addPictures(sampleId, title, imageUrl);
            res.json(newPicture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete a picture
    static async deletePicture(req, res) {
        try {
            const { pictureId } = req.params;
            const deletedPicture = await PicturesModel.deletePicture(pictureId);
            res.json(deletedPicture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default PicturesController;
