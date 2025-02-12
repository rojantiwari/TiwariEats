import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { prisma } from "../db/db.config";



export const addMenu = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        const restaurant = await prisma.restaurant.findFirst({
            where: { userId: req.id }
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        const menu = await prisma.menu.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image: imageUrl,
                restaurantId: restaurant.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const file = req.file;

        const menu = await prisma.menu.findUnique({
            where: { id }
        });

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
        }

        let imageUrl = menu.image;
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        }

        const updatedMenu = await prisma.menu.update({
            where: { id },
            data: {
                name: name || menu.name,
                description: description || menu.description,
                price: price ? parseFloat(price) : menu.price,
                image: imageUrl
            }
        });

        return res.status(200).json({
            success: true,
            message: "Menu updated",
            menu: updatedMenu,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
