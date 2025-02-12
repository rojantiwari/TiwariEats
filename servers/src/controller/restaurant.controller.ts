import { Request, Response } from "express";
import { prisma } from "../db/db.config";
import uploadImageOnCloudinary from "../utils/imageUpload";



export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        const existingRestaurant = await prisma.restaurant.findFirst({
            where: { userId: req.id },
        });

        if (existingRestaurant) {
            return res.status(400).json({ success: false, message: "Restaurant already exists for this user" });
        }

        if (!file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        await prisma.restaurant.create({
            data: {
                userId: req.id,
                restaurantName,
                city,
                country,
                deliveryTime: Number(deliveryTime),
                cuisines,
                imageURL: imageUrl,
            },
        });

        return res.status(201).json({ success: true, message: "Restaurant Added" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { userId: req.id },
            include: { menus: true },
        });

        if (!restaurant) {
            return res.status(404).json({ success: false, restaurant: [], message: "Restaurant not found" });
        }

        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        const restaurant = await prisma.restaurant.findFirst({ where: { userId: req.id } });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const imageUrl = file ? await uploadImageOnCloudinary(file as Express.Multer.File) : restaurant.imageURL;

        const updatedRestaurant = await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
                restaurantName,
                city,
                country,
                deliveryTime: Number(deliveryTime),
                cuisines,
                imageURL: imageUrl,
            },
        });

        return res.status(200).json({ success: true, message: "Restaurant updated", restaurant: updatedRestaurant });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await prisma.restaurant.findFirst({ where: { userId: req.id } });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const orders = await prisma.order.findMany({
            where: { restaurantId: restaurant.id },
            include: { user: true, restaurant: true },
        });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        })
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return res.status(200).json({
            success: true,
            status: updatedOrder.status,
            message: "Status updated"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);

        // Construct Prisma filter object
        const query: any = {};

        // Basic search based on restaurantName, city, or country
        if (searchText) {
            query.OR = [
                { restaurantName: { contains: searchText, mode: "insensitive" } },
                { city: { contains: searchText, mode: "insensitive" } },
                { country: { contains: searchText, mode: "insensitive" } },
            ];
        }

        // Additional filter based on searchQuery (for name and cuisines)
        if (searchQuery) {
            query.OR = [
                { restaurantName: { contains: searchQuery, mode: "insensitive" } },
                { cuisines: { hasSome: [searchQuery] } } // If cuisines is an array
            ];
        }

        // Filter by selected cuisines if provided
        if (selectedCuisines.length > 0) {
            query.cuisines = { hasSome: selectedCuisines }; // Works if `cuisines` is a string array in the schema
        }

        // Fetch restaurants from Prisma
        const restaurants = await prisma.restaurant.findMany({
            where: query,
        });

        return res.status(200).json({
            success: true,
            data: restaurants,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: { menus: true },
        });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
