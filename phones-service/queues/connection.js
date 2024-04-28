const client = require('amqplib');

async function createConnection() {
  try {
    const connection = await client.connect(`${process.env.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.log('error', 'UserService createConnection() method error:');
    return undefined;
  }
}

module.exports = { createConnection };
