import { Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { COMMANDS } from "./commands/index.js";
import { registerSlashCommands } from "./registerCommands.js";
import { handlePanelButton } from "./interactions/panelButtons.js";
import { handleRegionButton } from "./interactions/regionSelect.js";
import { handleIntlButton } from "./interactions/internationalSelect.js";
import { handleRangeButton } from "./interactions/forecastRange.js";
import { handleNotifyModal } from "./interactions/notifyModal.js";
import { startScheduler } from "./scheduler/dailyNotify.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildIds = (process.env.DISCORD_GUILD_IDS ?? process.env.DISCORD_GUILD_ID ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!token || !clientId) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  try {
    await registerSlashCommands({ token, clientId, guildIds });
  } catch (e) {
    console.error("[commands] failed to register:", e);
  }
  if (guildIds.length > 0) {
    // Leave any guild not in the allowlist (also handles future invites)
    for (const [id, guild] of c.guilds.cache) {
      if (!guildIds.includes(id)) {
        console.log(`[guard] leaving non-allowlisted guild ${id} (${guild.name})`);
        await guild.leave().catch((e) => console.error("[guard] leave failed:", e));
      }
    }
  }
  startScheduler(c);
});

client.on(Events.GuildCreate, async (guild) => {
  if (guildIds.length > 0 && !guildIds.includes(guild.id)) {
    console.log(
      `[guard] auto-leaving non-allowlisted guild ${guild.id} (${guild.name})`
    );
    await guild.leave().catch((e) => console.error("[guard] leave failed:", e));
  }
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = COMMANDS[interaction.commandName];
      if (cmd) await cmd.execute(interaction);
      return;
    }
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("panel:")) {
        await handlePanelButton(interaction);
      } else if (interaction.customId.startsWith("region:")) {
        await handleRegionButton(interaction);
      } else if (interaction.customId.startsWith("intl:")) {
        await handleIntlButton(interaction);
      } else if (interaction.customId.startsWith("range:")) {
        await handleRangeButton(interaction);
      }
      return;
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "notify:time") {
        await handleNotifyModal(interaction);
      }
      return;
    }
  } catch (e) {
    console.error("Interaction error:", e);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction
        .reply({ content: "エラーが発生しました。", flags: MessageFlags.Ephemeral })
        .catch(() => {});
    }
  }
});

client.login(token);
