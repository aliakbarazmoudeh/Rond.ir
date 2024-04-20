// const { createConnection } = require('./connection');

// const consumeFactorDirectMessage = async (channel) => {
//   try {
//     if (!channel) {
//       channel = await createConnection();
//     }
//     const exchangeName = 'FactorExchange';
//     const routingKey = 'Create';
//     const queueName = 'FactorCreateQueue';
//     await channel.assertExchange(exchangeName, 'direct');
//     const CustomerQueue = await channel.assertQueue(queueName, {
//       durable: true,
//       autoDelete: false,
//     });
//     await channel.bindQueue(CustomerQueue.queue, exchangeName, routingKey);
//     channel.consume(CustomerQueue.queue, async (msg) => {
//       const message = JSON.parse(msg.content.toString());
//       console.log(message);
//       // channel.ack(msg);
//     });
//   } catch (error) {
//     console.log(
//       'error',
//       'GigService GigConsumer consumeGigDirectMessage() method error'
//     );
//   }
// };

// module.exports = {consumeFactorDirectMessage}
