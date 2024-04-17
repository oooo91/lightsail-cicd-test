import express from "express";
import { RedisClientType } from "redis";

/**
 * 서비스 로직
 */

export const LIST_KEY = "messages";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client : RedisClient) => {
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.status(200).send("hello from express, deploy on AWS Lightsail");
    });

    app.post("/messages", async (req, res) => {
        const { message } = req.body;
        await client.lPush(LIST_KEY, message);
        res.status(200).send("Message added to list");
    });

    app.get("/messages", async (req, res) => {
        const messages = await client.lRange(LIST_KEY, 0, -1);
        res.status(200).send(messages);
    });

    return app;
};