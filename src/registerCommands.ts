import { REST, Routes } from "discord.js";
import { COMMANDS } from "./commands/index.js";

export async function registerSlashCommands(opts: {
  token: string;
  clientId: string;
  guildIds?: string[];
}) {
  const body = Object.values(COMMANDS).map((c) => c.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(opts.token);

  if (opts.guildIds && opts.guildIds.length > 0) {
    for (const guildId of opts.guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(opts.clientId, guildId),
        { body }
      );
      console.log(
        `[commands] registered ${body.length} commands to guild ${guildId}`
      );
    }
    return;
  }

  await rest.put(Routes.applicationCommands(opts.clientId), { body });
  console.log(`[commands] registered ${body.length} commands globally`);
}
