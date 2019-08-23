import { EventHubClient } from '@azure/event-hubs';
import moment = require('moment');

require('dotenv').config();

const client = EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING as string, "eh1");

let i = 0;
setInterval(async () => {
    let lag = Math.ceil(Math.random() * 10);
    let msg = { body: { timestamp: moment().subtract(lag,"seconds").toDate(), i: i++ } };
    await client.send(msg);
    console.log(msg);
}, 4);
