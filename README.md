# Weather Forecast Discord Bot

Discord 上で天気予報を確認できる Bot。TC に常設パネルを置き、ボタン/セレクトで地域を選んで予報を表示します。お気に入り登録すれば DM で毎日通知も受け取れます。

## 機能

- `/panel` でテキストチャンネルにパネルを設置
- パネルから:
  - 🔍 地方 → 都道府県 → 一次細分区域 で予報表示
  - ⭐ お気に入り地域をワンタップ表示
  - 📝 お気に入りを登録/変更
  - 🔔 DM 毎日通知の設定 (HH:MM, JST)
  - 🔕 通知解除
- 予報期間ボタンで「今日のみ / 3日間 / 7日間」を切り替え
- `/favorite show|clear` (救済用)

## 必要環境

- Node.js 20+
- MySQL 8+
- Discord Application & Bot Token

## セットアップ

```bash
cp .env.example .env
# .env を編集: DISCORD_TOKEN, DISCORD_CLIENT_ID, DATABASE_URL
# 動作許可サーバーをカンマ区切りで指定（DISCORD_GUILD_IDS=id1,id2,id3）
# 指定したサーバー以外には招待されても自動退出する。空ならグローバル登録。

npm install
npx prisma migrate dev --name init
npx tsx src/deploy-commands.ts
npm run dev
```

## データソース

- 予報: [Open-Meteo](https://open-meteo.com/) (APIキー不要)
- 地域: 気象庁の一次細分区域（`src/data/regions.ts` に同梱）

## デプロイ

VPS / Railway / Fly.io 等の 24/7 環境を想定。`node-cron` がプロセス内で毎分発火して DM 通知を送信するため、プロセスは常時起動している必要があります。

```bash
npm run build
npm start
```

## 注意

- お気に入り地域は平文で DB に保存されます（DB アクセス制御で保護）
- お気に入り未登録時は DM 通知を ON にできません
- お気に入り解除時は通知も自動停止されます
