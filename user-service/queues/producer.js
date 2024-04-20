const { createConnection } = require('./connection');

const publishDirectMessage = async (exchangeName, routingKey, message) => {
  try {
    channel = await createConnection();
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
    console.log('Message sent succecfuly');
  } catch (error) {
    console.log(
      'error',
      'GigService publishDirectMessage() method error:',
      error
    );
  }
};

module.exports = { publishDirectMessage };
