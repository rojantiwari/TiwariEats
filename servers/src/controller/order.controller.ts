import { Request, Response } from "express";
import { prisma } from "../db/db.config";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.id },
            include: { user: true, restaurant: true },
        });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: checkoutSessionRequest.restaurantId },
            include: { menus: true },
        });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found." });
        }

        const totalAmount = checkoutSessionRequest.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await prisma.order.create({
            data: {
                restaurantId: restaurant.id,
                userId: req.id,
                deliveryDetails: JSON.stringify(checkoutSessionRequest.deliveryDetails),
                cartItems: checkoutSessionRequest.cartItems,
                status: "pending",
                totalAmount
            },
        });

        //line items
        const menuItems = restaurant.menus
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: { allowed_countries: ["GB", "US", "CA"] },
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order.id,
                images: JSON.stringify(restaurant.menus.map((item) => item.image)),
            },
        });

        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }

        return res.status(200).json({ session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        event = stripe.webhooks.constructEvent(req.body, signature!, secret);
    } catch (error: any) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await prisma.order.findUnique({ where: { id: session.metadata?.orderId } });

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            await prisma.order.update({
                where: { id: order.id },
                data: { totalAmount: session.amount_total || 0, status: "confirmed" },
            });
        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    res.status(200).send();
};




export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {

    //create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item.id === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: "NPR",
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        };
    });

    return lineItems
};
