import type { Handler } from "../../util/register";
import { ARS } from "../../util/guilds";
import { wiki } from "./wiki";
import {mana} from "./mana";

export default {
    commands: [wiki, mana],
    guilds: ARS
} as Handler;
