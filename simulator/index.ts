const { EventHubClient } = require('@azure/event-hubs');

require('dotenv').config();

const client = EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING, "eh1");

setInterval(async () => {
    console.log('sending message to cloud -->');
    await client.send({ body: "my event body"});
}, 1000);
