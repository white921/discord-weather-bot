import { registerSlashCommands } from "./registerCommands.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set");
  process.exit(1);
}

await registerSlashCommands({ token, clientId, guildId });
