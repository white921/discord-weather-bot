import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export function buildPanelMessage() {
  const embed = new EmbedBuilder()
    .setTitle("🌤️ 天気予報パネル")
    .setDescription(
      "ボタンから天気を見たり、お気に入り・DM 通知を設定できます。\n\n" +
        "🔍 地域を選んで天気を見る\n" +
        "⭐ お気に入りの天気をワンタップで表示\n" +
        "📝 お気に入りを登録／変更\n" +
        "🔔 毎朝 DM で予報を受け取る\n" +
        "🔕 通知を停止"
    )
    .setColor(0x4a90e2);

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("panel:view")
      .setLabel("地域を選んで見る")
      .setEmoji("🔍")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("panel:fav-show")
      .setLabel("お気に入りを見る")
      .setEmoji("⭐")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("panel:fav-set")
      .setLabel("お気に入りを登録/変更")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Secondary)
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("panel:notify-on")
      .setLabel("DM 通知を設定")
      .setEmoji("🔔")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("panel:notify-off")
      .setLabel("DM 通知を解除")
      .setEmoji("🔕")
      .setStyle(ButtonStyle.Secondary)
  );

  return { embeds: [embed], components: [row1, row2] };
}
