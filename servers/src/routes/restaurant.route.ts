import express from "express";
import {
    createRestaurant,
    getRestaurant,
    getRestaurantOrder,
    getSingleRestaurant,
    searchRestaurant,
    updateOrderStatus,
    updateRestaurant
} from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";



const router = express.Router();


// ✅ Utility function to handle async errors correctly
const asyncHandler = (fn: any) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };




router.route("/")
    .post(asyncHandler(isAuthenticated), upload.single("imageFile"), asyncHandler(createRestaurant))
    .get(asyncHandler(isAuthenticated), asyncHandler(getRestaurant))
    .put(asyncHandler(isAuthenticated), upload.single("imageFile"), asyncHandler(updateRestaurant));

router.route("/order")
    .get(asyncHandler(isAuthenticated), asyncHandler(getRestaurantOrder));

router.route("/order/:orderId/status")
    .put(asyncHandler(isAuthenticated), asyncHandler(updateOrderStatus));

router.route("/search/:searchText")
    .get(asyncHandler(isAuthenticated), asyncHandler(searchRestaurant));

router.route("/:id")
    .get(asyncHandler(isAuthenticated), asyncHandler(getSingleRestaurant));

export default router;
