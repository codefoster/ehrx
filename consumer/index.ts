const { EventHubClient } = require('@azure/event-hubs');

require('dotenv').config();
const client = EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING, "eh1");

start();

async function start() {
    const pids = await client.getPartitionIds();

    //enumerate the partitions
    pids.map(pid =>
        client.receive(
            pid,
            event => {
                console.log(event.body);
            },
            error => { }
        )
    );
}
