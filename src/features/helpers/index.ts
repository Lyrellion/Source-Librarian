import type { Handler } from "../../util/register";
import { ARS } from "../../util/guilds";
import { wiki } from "./wiki";
import { mana } from "./mana";
import { glyphs } from "./glyphs";
import {claims} from "./claims";

export default {
    commands: [wiki, mana, glyphs, claims],
    guilds: ARS
} as Handler;
