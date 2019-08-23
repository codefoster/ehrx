import { EventHubClient, EventPosition } from '@azure/event-hubs';
import { Observable, Subject } from "rxjs";
import moment = require('moment');

require('dotenv').config();
const client = EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING as string, "eh1");
// const DELAY = 2000;
let events = new Subject();
let events$ = events.asObservable();
let messageCount = 0;
let startTime = moment();
let receiveLatencies: number[] = [];
let processLatencies: number[] = [];

start();

async function start() {
    const pids = await client.getPartitionIds();

    //enumerate the partitions
    pids.map(pid =>
        client.receive(
            pid,
            event => {
                // let delay = (DELAY - moment(event.body.timestamp).diff(moment(), "millisecond"));
                // console.log(`delay: ${delay}`);
                // setTimeout(() => events.next(event.body), delay);
                event.body.receiveTimestamp = moment().format();
                events.next(event.body);
            },
            error => { console.error(error) },
            { eventPosition: EventPosition.fromEnqueuedTime(moment().toDate()) }
        )
    );
}

events$
    .subscribe(
        (event: any) => {
            messageCount++;
            let receiveLatency = moment(event.receiveTimestamp).diff(event.timestamp, "milliseconds");
            let processLatency = moment().diff(moment(event.timestamp), "milliseconds");
            receiveLatencies.push(receiveLatency);
            processLatencies.push(processLatency);

            console.log(JSON.stringify({
                timestamp: event.timestamp,
                receiveTimestamp: event.receiveTimestamp,
                receiveLatency: receiveLatency,
                processTimestamp: moment().format(),
                processLatency: moment().diff(moment(event.timestamp), "milliseconds"),
                averageReceiveLatency: Math.round(receiveLatencies.reduce((a, c) => a + c, 0) / receiveLatencies.length),
                averageProcessLatency: Math.round(processLatencies.reduce((a, c) => a + c, 0) / processLatencies.length),
                rate: moment().diff(startTime, "milliseconds") / messageCount
            }, null, 2));
        }
    )
