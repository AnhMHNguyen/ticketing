import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // run all the events in NATS streaming for the fisrt time when the listener is turned on
      .setManualAckMode(true) // acknowledge all the events that run throught NATS streaming
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // create durable subscription to record all the processed and emitted events from publishes
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // make sure not to dump all the events inside the durable name even tho we restart the sevices and all the listeners go through one instance
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
  }
}