import { REST, Routes } from "discord.js";
import { COMMANDS } from "./commands/index.js";

export async function registerSlashCommands(opts: {
  token: string;
  clientId: string;
  guildId?: string;
}) {
  const body = Object.values(COMMANDS).map((c) => c.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(opts.token);
  const route = opts.guildId
    ? Routes.applicationGuildCommands(opts.clientId, opts.guildId)
    : Routes.applicationCommands(opts.clientId);
  await rest.put(route, { body });
  console.log(
    `[commands] registered ${body.length} commands ${opts.guildId ? `to guild ${opts.guildId}` : "globally"}`
  );
}
