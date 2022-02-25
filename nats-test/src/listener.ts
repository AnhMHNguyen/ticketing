import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  /* const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // acknowledge all the events that run throught NATS streaming
    .setDeliverAllAvailable() // run all the events in NATS streaming for the fisrt time when the listener is turned on
    .setDurableName('account-service'); // create durable subscription to record all the processed and emitted events from publishes

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group', // make sure not to dump all the events inside the durable name even tho we restart the sevices and all the listeners go through one instance
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack();
  });
  */
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



