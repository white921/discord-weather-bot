import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { buildPanelMessage } from "../ui/panel.js";

export const data = new SlashCommandBuilder()
  .setName("panel")
  .setDescription("天気予報パネルをこのチャンネルに設置します")
  .setDMPermission(false);

// Users allowed to run /panel regardless of server permissions.
// Comma-separated Discord user IDs in DISCORD_PANEL_USER_IDS.
function panelAllowedUserIds(): string[] {
  return (process.env.DISCORD_PANEL_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const allowed =
    panelAllowedUserIds().includes(interaction.user.id) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) === true;

  if (!allowed) {
    await interaction.reply({
      content: "🔒 `/panel` はサーバー管理者または許可ユーザーのみ実行できます。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (!interaction.channel || !("send" in interaction.channel)) {
    await interaction.reply({
      content: "このチャンネルには設置できません。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await interaction.channel.send(buildPanelMessage());
  await interaction.reply({ content: "パネルを設置しました。", flags: MessageFlags.Ephemeral });
}
