import {Handler} from "../../util/register";
import {ALL} from "../../util/guilds";
import {logs} from "./logs";

export default {
    commands: [logs],
    guilds: ALL
} as Handler
