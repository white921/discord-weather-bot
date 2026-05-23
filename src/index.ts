import { Client, Events, GatewayIntentBits, Interaction } from "discord.js";
import { COMMANDS } from "./commands/index.js";
import { registerSlashCommands } from "./registerCommands.js";
import { handlePanelButton } from "./interactions/panelButtons.js";
import { handleRegionSelect } from "./interactions/regionSelect.js";
import { handleRangeButton } from "./interactions/forecastRange.js";
import { handleNotifyModal } from "./interactions/notifyModal.js";
import { startScheduler } from "./scheduler/dailyNotify.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  try {
    await registerSlashCommands({ token, clientId, guildId });
  } catch (e) {
    console.error("[commands] failed to register:", e);
  }
  startScheduler(c);
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
      } else if (interaction.customId.startsWith("range:")) {
        await handleRangeButton(interaction);
      }
      return;
    }
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith("region:")) {
        await handleRegionSelect(interaction);
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
        .reply({ content: "エラーが発生しました。", ephemeral: true })
        .catch(() => {});
    }
  }
});

client.login(token);
