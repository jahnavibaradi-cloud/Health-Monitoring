const amqp = require('amqplib');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const startWorker = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'alert_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const alert = JSON.parse(msg.content.toString());
        console.log(" [x] Received Alert:", alert);

        // Here you would implement logic to send email/SMS/Push Notification
        // For now, we just log it.

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Worker Error:', error);
  }
};

startWorker();
