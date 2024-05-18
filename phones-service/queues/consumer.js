const { createConnection } = require("./connection");
const User = require("../models/User");

const createUser = async (data) => {
  const user = User.create(data);
};

const deleteUser = async (data) => {
  const user = await User.findByPk(parseInt(data.id));
  await user.destroy();
};

const updateUser = async (data) => {
  const user = await User.findByPk(parseInt(data.id));
  user.set(data);
  delete data.id;
  await user.save();
};

const consumeUserRegisterDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = "User";
    const routingKey = "register";
    const queueName = "UserRegisterPhoneQueue";
    await channel.assertExchange(exchangeName, "direct");
    const CustomerQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(CustomerQueue.queue, exchangeName, routingKey);
    channel.consume(CustomerQueue.queue, async (msg) => {
      // data is object
      const data = JSON.parse(msg.content.toString());
      await createUser(data);
      channel.ack(msg);
    });
  } catch (error) {
    console.log(
      "error",
      "PhoneService PhoneConsumer consumeUserRegisterDirectMessage method error",
    );
  }
};

const consumeUserDeleteDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = "User";
    const routingKey = "delete";
    const queueName = "UserDeletePhoneQueue";
    await channel.assertExchange(exchangeName, "direct");
    const CustomerQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(CustomerQueue.queue, exchangeName, routingKey);
    channel.consume(CustomerQueue.queue, async (msg) => {
      // data is object
      const data = JSON.parse(msg.content.toString());
      await deleteUser(data);
      channel.ack(msg);
    });
  } catch (error) {
    console.log(
      "error",
      "PhoneService PhoneConsumer consumeUserDeleteDirectMessage() method error",
    );
  }
};

const consumeUserUpdateDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = "User";
    const routingKey = "update";
    const queueName = "UserUpdatePhoneQueue";
    await channel.assertExchange(exchangeName, "direct");
    const CustomerQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(CustomerQueue.queue, exchangeName, routingKey);
    channel.consume(CustomerQueue.queue, async (msg) => {
      // data is object
      const data = JSON.parse(msg.content.toString());
      await updateUser(data);
      channel.ack(msg);
    });
  } catch (error) {
    console.log(
      "error",
      "PhoneService PhoneConsumer consumeUserUpdateDirectMessage() method error",
    );
  }
};

module.exports = {
  consumeUserRegisterDirectMessage,
  consumeUserDeleteDirectMessage,
  consumeUserUpdateDirectMessage,
};
