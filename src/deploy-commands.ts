import { REST, Routes } from "discord.js";
import * as panelCmd from "./commands/panel.js";
import * as favoriteCmd from "./commands/favorite.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set");
  process.exit(1);
}

const body = [panelCmd.data.toJSON(), favoriteCmd.data.toJSON()];

const rest = new REST({ version: "10" }).setToken(token);

const route = guildId
  ? Routes.applicationGuildCommands(clientId, guildId)
  : Routes.applicationCommands(clientId);

await rest.put(route, { body });
console.log(
  `Registered ${body.length} commands ${guildId ? `to guild ${guildId}` : "globally"}.`
);
