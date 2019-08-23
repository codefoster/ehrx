"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_hubs_1 = require("@azure/event-hubs");
const rxjs_1 = require("rxjs");
const moment = require("moment");
require('dotenv').config();
const client = event_hubs_1.EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING, "eh1");
// const DELAY = 2000;
let events = new rxjs_1.Subject();
let events$ = events.asObservable();
let messageCount = 0;
let startTime = moment();
let receiveLatencies = [];
let processLatencies = [];
start();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const pids = yield client.getPartitionIds();
        //enumerate the partitions
        pids.map(pid => client.receive(pid, event => {
            // let delay = (DELAY - moment(event.body.timestamp).diff(moment(), "millisecond"));
            // console.log(`delay: ${delay}`);
            // setTimeout(() => events.next(event.body), delay);
            event.body.receiveTimestamp = moment().format();
            events.next(event.body);
        }, error => { console.error(error); }, { eventPosition: event_hubs_1.EventPosition.fromEnqueuedTime(moment().toDate()) }));
    });
}
events$
    .subscribe((event) => {
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
});
