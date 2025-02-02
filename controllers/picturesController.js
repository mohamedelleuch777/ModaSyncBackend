import PicturesModel from "../models/picturesModel.js";
import exportedFunctions from "../middlewares/uploaderMiddlewares.js";
import multer from "multer";
import fs from "fs";
import env from "../config/env.js";

const { STATIC_URL } = env;

const { upload } = exportedFunctions;

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
            const { title, imageUrl, imagePath } = req.body;
            const newPicture = await PicturesModel.addPictures(sampleId, title, imageUrl, imagePath);
            res.json(newPicture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete a picture
    static async deletePicture(req, res) {
        try {
            const { pictureId } = req.params;
            const { changes, deletedItem } = await PicturesModel.deletePicture(pictureId);

            // If no rows were deleted, the pictureId was not found.
            if (changes === 0) {
                return res.status(404).json({ error: "Picture not found" });
            }

            // remove the picture from this path deletedItem.imagePath
            const filePath = deletedItem.image_path;
            if (filePath) {
                // const filePathParts = filePath.split('/');
                // const fileName = filePathParts[filePathParts.length - 1];
                // const filePathDir = filePathParts.slice(0, -1).join('/');
                // const deletePath = filePathDir + '/' + fileName;
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error(err);
                }
            }

            res.json({ message: "Picture deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Picture upload
    static uploadPicture = (req, res) => {
        // Use the multer middleware to handle the file upload.
        upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred (e.g., file too large).
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.status(200).json({
            message: 'Picture uploaded successfully',
            filePath: req.file.path, // The saved file path on the server.
            fileUrl: STATIC_URL + '/img/' + req.file.filename
        });
        });
    };

}

export default PicturesController;
