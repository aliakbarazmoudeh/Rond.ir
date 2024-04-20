const { createConnection } = require('./connection');
const User = require('../models/User');

const createUser = async (data) => {
  const user = User.create(data);
  return;
};

const deleteUser = async (data) => {
  const user = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
  await user.destroy();
  return;
};

const updateUser = async (data) => {
  const user = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
  user.set(data);
  await user.save({
    fields: [
      'phoneNumber',
      'address',
      'productCount',
      'telephoneNumber',
      'userLevel',
    ],
  });
  return;
};

const consumeUserRegisterDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'User';
    const routingKey = 'register';
    const queueName = 'UserRegisterSimQueue';
    await channel.assertExchange(exchangeName, 'direct');
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
      'error',
      'GigService GigConsumer consumeGigDirectMessage() method error'
    );
  }
};

const consumeUserDeleteDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'User';
    const routingKey = 'delete';
    const queueName = 'UserDeleteQueue';
    await channel.assertExchange(exchangeName, 'direct');
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
      'error',
      'GigService GigConsumer consumeGigDirectMessage() method error'
    );
  }
};

const consumeUserUpdateDirectMessage = async (channel) => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'User';
    const routingKey = 'update';
    const queueName = 'UserUpdateQueue';
    await channel.assertExchange(exchangeName, 'direct');
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
      'error',
      'GigService GigConsumer consumeGigDirectMessage() method error'
    );
  }
};

module.exports = {
  consumeUserRegisterDirectMessage,
  consumeUserDeleteDirectMessage,
  consumeUserUpdateDirectMessage,
};
