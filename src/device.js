import { EventEmitter } from 'node:events';
import WebSocket from 'ws';

class Client extends EventEmitter {
  constructor({ address = '', options = {} }) {
    super();
    this.address = address;
    this.options = options;
    this.ws = null;
    this.interval = null;
    this.time = new Date();
    this.isConnect = false;
  }
  connect() {
    this.ws = new WebSocket(this.address, this.options);
    this.ws.on('open', this.onOpen.bind(this));
    this.ws.on('message', this.onMessage.bind(this));
    this.ws.on('close', this.onClose.bind(this));
    this.ws.on('error', this.onError.bind(this));
    if (!this.interval) this.interval = setInterval(this.onPing.bind(this), 1000);
  }
  disconnect() {
    if (this.interval) clearInterval(this.interval);
    this.ws = null;
    this.emit('close');
  }
  reconnect() {
    this.emit('reconnect');
    this.time = new Date().getTime();
    this.connect();
  }
  onPing() {
    const delta = new Date().getTime() - this.time;
    this.emit('ping', delta);
    this.isConnect = delta < 3000;
    if (delta > 20000) this.reconnect();
  }
  onOpen() {
    // this.ws.send('something');
  }
  onMessage(data) {
    this.time = new Date().getTime();
    console.log('received: %s', new Date());
  }
  onClose() {
    console.log('close');
    this.emit('close');
  }
  onError(e) {
    console.log(e);
    this.emit('error', e);
  }
}

export default Client;
