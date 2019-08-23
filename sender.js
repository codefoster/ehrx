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
const moment = require("moment");
require('dotenv').config();
const client = event_hubs_1.EventHubClient.createFromConnectionString(process.env.CONNECTION_STRING, "eh1");
let i = 0;
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    // let lag = Math.ceil(Math.random() * 10);
    // let msg = { body: { timestamp: moment().subtract(lag,"seconds").toDate(), i: i++ } };
    let msg = { body: { timestamp: moment().toDate(), i: i++ } };
    yield client.send(msg);
    console.log(msg);
}), 4);
