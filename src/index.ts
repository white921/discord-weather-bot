import { Client, Events, GatewayIntentBits, Interaction } from "discord.js";
import * as panelCmd from "./commands/panel.js";
import * as favoriteCmd from "./commands/favorite.js";
import { handlePanelButton } from "./interactions/panelButtons.js";
import { handleRegionSelect } from "./interactions/regionSelect.js";
import { handleRangeButton } from "./interactions/forecastRange.js";
import { handleNotifyModal } from "./interactions/notifyModal.js";
import { startScheduler } from "./scheduler/dailyNotify.js";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("DISCORD_TOKEN is not set");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  startScheduler(c);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "panel") {
        await panelCmd.execute(interaction);
      } else if (interaction.commandName === "favorite") {
        await favoriteCmd.execute(interaction);
      }
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
