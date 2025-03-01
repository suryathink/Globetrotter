import express from "express";
import { DestinationController } from "../../controllers/destination.controller";
const router = express.Router();

router.get("/random", DestinationController.Random as any);
router.get("/options/:id", DestinationController.fetchOptions as any);
router.post("/verify", DestinationController.verify as any);

export default router;
/*
GET /api/destination/random → Fetch a random destination with 1-2 clues.
POST /api/destination/validate → Check if the user’s guess is correct.
GET /api/destination/all → Fetch the full list (Admin only).

*/
