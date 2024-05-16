const { createConnection } = require("./connection");

const publishDirectMessage = async (exchangeName, routingKey, message) => {
  let channel;
  try {
    channel = await createConnection();
    await channel.assertExchange(exchangeName, "direct");
    channel.publish(exchangeName, routingKey, Buffer.from(message));
  } catch (error) {
    console.log(
      "error",
      "AdService publishDirectMessage() method error:",
      error,
    );
  }
};

module.exports = { publishDirectMessage };
