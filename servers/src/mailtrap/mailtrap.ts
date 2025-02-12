
import { MailtrapClient } from "mailtrap"
import dotenv from "dotenv"
dotenv.config()




export const client = new MailtrapClient({
    token: "0e6a5b0a9de44dfd15e83687cb4a1d71",
});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "Tiwari Eats",
};