import express from "express";
import SubCollectionsController from "../controllers/subCollectionsController.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";

const router = express.Router();

const { authenticateToken, isManager } = exportedFunctions;

router.get("/:collectionId", authenticateToken, SubCollectionsController.getAllSubCollections);
router.post("/", authenticateToken, SubCollectionsController.createSubCollection);
router.put("/:id", authenticateToken, SubCollectionsController.editSubCollection);
router.delete("/:id", authenticateToken, SubCollectionsController.removeSubCollection);

export default router;
