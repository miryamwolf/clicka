import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const roomController = new RoomController();
const roomRouter = Router();


roomRouter.get("/getAllRooms", roomController.getRooms.bind(roomController));
roomRouter.post("/createRoom", roomController.createRoom.bind(roomController));
roomRouter.put("/updateRoom/:id", roomController.updateRoom.bind(roomController));
roomRouter.get("/getRoomById/:id", roomController.getRoomById.bind(roomController));
roomRouter.delete("/deleteRoom/:id", roomController.deleteRoom.bind(roomController));

export default roomRouter;
