import { Channel } from "amqplib";

export const MSG_PRODUCER = async (channel: Channel, requestQueue: string, data: any, correlationId: string): Promise<void> => {
    if (!channel) throw new Error("RabbitMQ channel is not initialized");

    try {
        await channel.assertQueue(requestQueue, { durable: true });

        channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(data)), {
            correlationId,
            persistent: true,
        });

        console.log(`[Producer] Message sent to queue: ${requestQueue}, Correlation ID: ${correlationId}`);
    } catch (error) {
        console.error(`Error sending message to queue ${requestQueue}`, error);
        throw error;
    }
};
