import express from "express";
import PicturesController from "../controllers/picturesController.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";

const router = express.Router();

const { authenticateToken, isManager } = exportedFunctions;

router.get("/:sampleId", authenticateToken, PicturesController.getSample_sPictures);
router.post("/:sampleId", authenticateToken, PicturesController.addPictures);
router.delete("/:pictureId", authenticateToken, PicturesController.deletePicture);

export default router;
