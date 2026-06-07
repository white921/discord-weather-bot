# おすすめ服装 画像対応 — 設計仕様

## 目的

「おすすめの服装」ボタンの応答に、その日の最高気温に応じた服装イラスト画像を添付する。
画像は気温帯ごとに事前用意した8枚（同梱）を使い、メッセージ本文は画像と重複するメイン服装アドバイスを省いて簡素化する。

## 前提・素材

- 画像は `assets/outfit/temperature-only/` に8枚同梱（768×768 PNG・各約200KB）。
- ファイル名と気温帯（最高気温 `tmax`）の対応:

  | ファイル | 条件 |
  |---|---|
  | `temp_30plus.png` | tmax ≥ 30 |
  | `temp_26_29.png` | 26 ≤ tmax < 30 |
  | `temp_22_25.png` | 22 ≤ tmax < 26 |
  | `temp_18_21.png` | 18 ≤ tmax < 22 |
  | `temp_14_17.png` | 14 ≤ tmax < 18 |
  | `temp_10_13.png` | 10 ≤ tmax < 14 |
  | `temp_6_9.png` | 6 ≤ tmax < 10 |
  | `temp_under6.png` | tmax < 6 |

  境界値は既存 `clothingByTemp()` と一致。

## 設計

### 1. 画像パス解決

- `src` 外のトップレベル `assets/` に置く（`tsc` の `rootDir: src` 対象外、`.gitignore` 対象外なのでコミットされる）。
- 実行時は `path.resolve("assets/outfit/temperature-only/<file>")`（cwd = project root 基準）で解決。dev(`tsx src/index.ts`)・本番(`node dist/index.js`)とも root から起動するため両対応。

### 2. 気温→ファイル選択関数

`formatter.ts` に追加:

```ts
export function outfitImageFile(tmax: number): string // 例: "temp_26_29.png"
```

8段階分岐。`clothingByTemp` と同じ境界値。

### 3. `buildOutfitSuggestion` の変更

戻り値を `string` から次の形に変更し、本文と画像ファイル名を同じ日（同じ `tmax`）で一貫させる:

```ts
{ content: string; imageFile: string }
```

本文の変更点:
- **削除**: メイン服装アドバイス1行（`・${clothingByTemp(tmax)}`）。画像が表すため重複。
- **残す**: ヘッダー（`## 👕 {日付} のおすすめ服装 — {地域}`）、サマリー行、追加アドバイス（寒暖差・雨雪雷・冷え込み・風・熱中症・紫外線）、注記フッター。
- 追加アドバイスが0件の場合、空のアドバイス行ブロックを挟まない（余分な空行を出さない）。

`clothingByTemp()` は他で未使用になるため削除する。

### 4. ボタン応答での添付

`src/interactions/outfitButton.ts`:
- `buildOutfitSuggestion()` から `{ content, imageFile }` を受け取る。
- `new AttachmentBuilder(path.resolve("assets/outfit/temperature-only/", imageFile))` を生成。
- `interaction.editReply({ content, files: [attachment] })`。
- 既存のエラーハンドリング（取得失敗時のテキスト返信）は維持。

## 影響範囲

- `assets/outfit/temperature-only/*.png`（新規・コミット）
- `src/weather/formatter.ts`（`outfitImageFile` 追加、`buildOutfitSuggestion` 戻り値変更、`clothingByTemp` 削除）
- `src/interactions/outfitButton.ts`（添付対応）

`buildOutfitSuggestion` の利用箇所は `outfitButton.ts` のみ（grep 確認済み）。

## 検証

- `npm run build`（tsc）が通ること。
- 気温帯ごとに `outfitImageFile()` が正しいファイル名を返すこと（境界値 6/10/14/18/22/26/30 を確認）。
- 実際のボタン操作で画像が添付され、本文からメイン服装行が消えていること。

## 非対象（YAGNI）

- 雨/雪バリエーション画像、AI都度生成、画像内ラベルとヘッダー重複の解消は今回やらない。
