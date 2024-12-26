import amqp, { Channel, Connection } from "amqplib";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

export const PRODUCT_REQUEST = "PRODUCT_REQUEST"
export const PRODUCT_RESPONSE = "PRODUCT_RESPONSE"

let channel: Channel;
let connection: Connection;

const RabbitMQService = async (): Promise<void> => {
    try {
        if (!process.env.RABBIT_MQ_URL) {
            throw new Error("Message broker URL is not defined in .env");
        }
        connection = await amqp.connect(process.env.RABBIT_MQ_URL)
        channel = await connection.createChannel()

        logger.info("RabbitMQ connected successfully");

    } catch (error) {
        logger.error("Error connecting to RabbitMQ", error);
    }
};

export { RabbitMQService, channel, connection };
