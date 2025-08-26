import { Router } from "express";
import {
  createPricingTierController,
  createPricingTierWithHistoryController,
  getCurrentPricingTierController,
  getPricingHistoryController,
  updatePricingTierController,
  deletePricingTierController,
  bulkUpdatePricingTiersController,
  createMeetingRoomPricingController,
  createMeetingRoomPricingWithHistoryController, 
  getCurrentMeetingRoomPricingController,
  getMeetingRoomPricingHistoryController,
  updateMeetingRoomPricingController,
  deleteMeetingRoomPricingController,
  createLoungePricingController,
  getCurrentLoungePricingController,
  getLoungePricingHistoryController,
  updateLoungePricingController,
  deleteLoungePricingController,
} from "../controllers/pricing.controller";
import { authorizeUser } from "../middlewares/authorizeUserMiddleware"; 
import { UserRole } from 'shared-types';

const router = Router();
// === Workspace Pricing Tiers ===
// Create and update operations require admin privileges
router.post("/workspace", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierController); 
router.post("/workspace/history", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierWithHistoryController);

// Read (GET) operations do not require admin privileges (for "Rachel")
router.get("/workspace/current/:workspaceType", getCurrentPricingTierController);
router.get("/workspace/history/:workspaceType", getPricingHistoryController);

// Update and delete operations require admin privileges
router.put("/workspace/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updatePricingTierController);
router.delete("/workspace/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deletePricingTierController); 
router.put("/workspace", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), bulkUpdatePricingTiersController);

// === Meeting Room Pricing ===
// Create and update operations require admin privileges
router.post("/meeting-room", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createMeetingRoomPricingController);
router.post("/meeting-room/history", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createMeetingRoomPricingWithHistoryController); 

// Read (GET) operations do not require admin privileges
router.get("/meeting-room/current", getCurrentMeetingRoomPricingController);
router.get("/meeting-room/history", getMeetingRoomPricingHistoryController);

// Update and delete operations require admin privileges
router.put("/meeting-room/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updateMeetingRoomPricingController);
router.delete("/meeting-room/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deleteMeetingRoomPricingController);

// === Lounge Pricing ===
// Create and update operations require admin privileges
router.post("/lounge", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createLoungePricingController);

// Read (GET) operations do not require admin privileges
router.get("/lounge/current", getCurrentLoungePricingController);
router.get("/lounge/history", getLoungePricingHistoryController);

// Update and delete operations require admin privileges
router.put("/lounge/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updateLoungePricingController);
router.delete("/lounge/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deleteLoungePricingController);

// === Workspace Pricing Tiers (Additional Paths) ===
// Create and update operations require admin privileges
router.put("/tier/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updatePricingTierController); // Change here
router.post("/tier", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierController);
router.get("/tier/current", getCurrentPricingTierController);

// Route for testing without authorization
router.get('/test', (req, res) => {
  res.json({ message: 'pricing route is working!' });
});

export default router;