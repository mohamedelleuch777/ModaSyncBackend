import express from "express";
import SamplesController from "../controllers/samplesController.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";

const router = express.Router();

const { authenticateToken, isManager } = exportedFunctions;

router.get("/:subcollectionId", authenticateToken, SamplesController.getAllSamples);
router.post("/", authenticateToken, SamplesController.createSample);
router.put("/:id", authenticateToken, SamplesController.editSample);
router.delete("/:id", authenticateToken, SamplesController.removeSample);

export default router;
