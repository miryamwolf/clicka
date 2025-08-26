import { Router } from "express";
import { RoomFeatureController } from "../controllers/roomFeature.controller";

const featureController = new RoomFeatureController();
const featureRouter = Router();

featureRouter.get("/getAllFeaturs", featureController.getAllFeatures.bind(featureController));
featureRouter.get("/getFeatureById/:id", featureController.getFeatureById.bind(featureController));
featureRouter.post("/createFeature", featureController.createRoomFeature.bind(featureController));
featureRouter.put("/updateFeature/:id", featureController.updateFeature.bind(featureController));
featureRouter.delete("/deleteFeature/:id", featureController.deleteFeature.bind(featureController));
export default featureRouter;