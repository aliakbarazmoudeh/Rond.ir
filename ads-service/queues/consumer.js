const { createConnection } = require("./connection");
const User = require("../models/User");

const createUser = async (data) => {
  const user = User.create(data);
};

const deleteUser = async (data) => {
  const user = await User.findByPk(data.id);
  await user.destroy();
};

const updateUser = async (data) => {
  const user = await User.findByPk(data.id);
  user.set(data);
  await user.save({
    fields: [
      "phoneNumber",
      "address",
      "productCount",
      "telephoneNumber",
      "userLevel",
    ],
  });
};

const consumeUserRegisterDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = "User";
    const routingKey = "register";
    const queueName = "UserRegisterAdQueue";
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
      "AdService AdConsumer consumeUserRegisterDirectMessage() method error",
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
    const queueName = "UserDeleteAdQueue";
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
      "AdService AdConsumer consumeUserDeleteDirectMessage() method error",
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
    const queueName = "UserUpdateDomainQueue";
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
      "AdService AdConsumer consumeUserUpdateDirectMessage() method error",
    );
  }
};

module.exports = {
  consumeUserRegisterDirectMessage,
  consumeUserDeleteDirectMessage,
  consumeUserUpdateDirectMessage,
};
