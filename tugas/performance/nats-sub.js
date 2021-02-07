const nats = require('nats');
const { createClient, getAsync, setAsync } = require('../database/key/redist');

const client = nats.connect();

client.on('connect', () => {
  main();
});

client.on('error', (err) => {
  console.log({ msg: err });
});

function subscriber() {
  client.subscribe('task.get', async (msg, reply, subject, sid) => {
    console.log('get');
    const clientRed = createClient();
    const redisGet = getAsync(clientRed);

    try {
      const get = await redisGet('task.trial');
      console.log(JSON.parse(get));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.create', async (msg, reply, subject, sid) => {
    console.log('create');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.delete', async (msg, reply, subject, sid) => {
    console.log('delete');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.completed', async (msg, reply, subject, sid) => {
    console.log('completed');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('worker.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('worker.register', async (msg, reply, subject, sid) => {
    console.log('register');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('worker.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('worker.trial', JSON.stringify(data, null, 2));
      console.log(await redisGet('worker.trial'));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('worker.delete', async (msg, reply, subject, sid) => {
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('worker.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('worker.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('worker.get', async (msg, reply, subject, sid) => {
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('worker.trial'));
      data.push({ task: msg, date: getCurrentDate() });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  });
}

function streamer() {
  // Ceritanya dari controller
  const messageBusDelete = {
    status: 'success',
    message: 'success delete task',
  };

  const messageBusCompleted = {
    status: 'success',
    message: 'success completed task',
  };

  const messageBusCreate = {
    status: 'success',
    message: 'success add task',
  };

  // event
  client.publish('task.create', JSON.stringify(messageBusCreate, null, 2));
  client.publish('task.delete', JSON.stringify(messageBusDelete, null, 2));
  client.publish(
    'task.completed',
    JSON.stringify(messageBusCompleted, null, 2)
  );

  const workerRegister = {
    status: 'success',
    message: 'success get data',
  };

  const workerGet = {
    status: 'success',
    message: 'success get data',
  };

  const workerDelete = {
    status: 'success',
    message: 'success delete data',
  };

  client.publish('worker.register', JSON.stringify(workerRegister, null, 2));
  client.publish('worker.delete', JSON.stringify(workerDelete, null, 2));
  client.publish('worker.get', JSON.stringify(workerGet, null, 2));
}

function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function main() {
  subscriber();
  streamer();
}
