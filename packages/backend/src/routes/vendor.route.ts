// // vendor-router.ts
// import { Router } from "express";
// // import { VendorController } from "../controllers/vendor.controller";
// import { UserRole } from "shared-types";
// // import { VendorController } from "../controllers/vendor-controller";
// import { authorizeUser } from "../middlewares/authorizeUser-middleware";
// // import { UserRole } from "../../../../types/auth";

// const vendorController = new VendorController();
// const vendorRouter = Router();

// vendorRouter.post("/createVendor", vendorController.create.bind(vendorController));
// vendorRouter.get("/", authorizeUser([UserRole.ADMIN, UserRole.MANAGER]), vendorController.getAll.bind(vendorController));
// vendorRouter.get("/getVendorById/:id", vendorController.getById.bind(vendorController));
// vendorRouter.put("/updateVendor/:id", vendorController.update.bind(vendorController));
// vendorRouter.delete("/deleteVendor/:id", vendorController.delete.bind(vendorController));

// export default vendorRouter;