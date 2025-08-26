import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
const bookController = new BookingController();
const bookRouter = Router();

bookRouter.get("/getAllBooking", bookController.getAllBooking.bind(bookController));
bookRouter.post("/", bookController.createBook.bind(bookController));
bookRouter.get("/getBookingById/:id", bookController.getBookingById.bind(bookController));
bookRouter.get("/getBookingByEventId/:eventId", bookController.getBookingByEventId.bind(bookController));
bookRouter.patch("/updateBooking/:id", bookController.updateBooking.bind(bookController));
bookRouter.delete("/deleteBooking/:id", bookController.deleteRoom.bind(bookController));
bookRouter.put("/bookingApproval/:id", bookController.bookingApproval.bind(bookController));

export default bookRouter;