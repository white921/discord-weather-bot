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
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
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
