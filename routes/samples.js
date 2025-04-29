import express from "express";
import SamplesController from "../controllers/samplesController.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";

const router = express.Router();

const { authenticateToken, isManager } = exportedFunctions;

// static routes
router.post("/", authenticateToken, SamplesController.createSample);
router.get("/availableSamples", authenticateToken, SamplesController.fetchAvailableSamples);

// dynamic routes
router.get("/:subcollectionId", authenticateToken, SamplesController.getAllSamples);
router.get("/sample/:sample_id", authenticateToken, SamplesController.getSampleById);
router.put("/:sample_id", authenticateToken, SamplesController.updateSampleStatus);
router.delete("/:sample_id", authenticateToken, SamplesController.deleteSampleById);

export default router;
