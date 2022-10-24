import client from './device';

const test = new client({ address: 'ws://192.168.10.21/esp' });

// console.log(test);
test.connect();

test.on('ping', (e) => {
  console.log('an event occurred!', e);
});

