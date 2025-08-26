import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizeUser}  from "../middlewares/authorizeUserMiddleware";
import { UserRole } from "shared-types";

const userController = new UserController();
const userRouter = Router();

//לברר איזה הרשאות יש לכל משתמש

//get
userRouter.get("/loginByGoogleId/:googleId", userController.loginByGoogleId.bind(userController));

userRouter.get("/getAllUsers", userController.getAllUsers.bind(userController));

userRouter.get("/getUserById/:id", userController.getUserById.bind(userController));

userRouter.get("/getUserByEmail/:email", userController.getUserByEmail.bind(userController));

//post

userRouter.post("/createUser", authorizeUser([UserRole.ADMIN,UserRole.MANAGER]),
userController.createUser.bind(userController));

userRouter.put("/updateGoogleIdUser/:id", userController.updateGoogleIdUser.bind(userController));

//put

userRouter.put("/updateUser/:id", authorizeUser([UserRole.ADMIN]), userController.updateUser.bind(userController));

//delete

userRouter.delete("/deleteUser/:id", authorizeUser([UserRole.ADMIN]), userController.deleteUser.bind(userController));

export default userRouter;