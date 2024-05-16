const client = require('amqplib');

async function createConnection() {
  try {
    const connection = await client.connect(`${process.env.RABBITMQ_ENDPOINT}`);
    return await connection.createChannel();
  } catch (error) {
    console.log('error', 'UserService createConnection() method error:');
    return undefined;
  }
}

module.exports = { createConnection };
