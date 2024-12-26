import { Channel } from "amqplib";

export const MSG_CONSUMER = (channel: Channel, queue: string, correlationId: string, timeoutMs = 5000): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!channel) {
            return reject(new Error("RabbitMQ channel is not initialized"));
        }

        channel.assertQueue(queue, { durable: true });

        const timeout = setTimeout(() => {
            reject(new Error(`Timeout: No response received for correlation ID ${correlationId}`));
        }, timeoutMs);

        channel.consume(queue, (msg) => {
            if (!msg || !msg.content) return;

            try {
                const data = JSON.parse(msg.content.toString());

                if (msg.properties.correlationId === correlationId) {
                    clearTimeout(timeout);
                    channel.ack(msg);
                    resolve(data);
                } else {
                    channel.nack(msg, false, true);
                }
            } catch (error) {
                clearTimeout(timeout);
                console.error("Error processing message:", error);
                channel.nack(msg, false, false);
                reject(error);
            }
        });
    });
};
